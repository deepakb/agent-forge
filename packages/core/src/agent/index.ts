import { Result, ok, err } from 'neverthrow';
import type {
  AgentConfig,
  Capability,
  Message,
  ExecutionResult,
  ToolCall,
  ExecutionContext,
} from '../types';
import { AgentConfigSchema, CapabilitySchema } from '../types';
import { ValidationError, CapabilityError, ErrorCodes } from '../errors';
import { Executor } from '../executor';
import {
  createValidationError,
  createCapabilityError,
} from '../utils/errorUtils';

export class Agent {
  private config: AgentConfig;
  private executor: Executor;

  constructor(config: AgentConfig, executor: Executor) {
    try {
      this.config = AgentConfigSchema.parse(config);
    } catch (error) {
      console.error('Validation error:', error);
      throw new ValidationError('Invalid agent configuration', {
        code: ErrorCodes.INVALID_CONFIG,
        cause: error as Error,
      });
    }

    this.executor = executor;
  }

  async addCapability(
    capability: Capability
  ): Promise<Result<void, ValidationError>> {
    try {
      const validatedCapability = CapabilitySchema.parse(capability);
      this.config.capabilities.push(validatedCapability);
      return ok(undefined);
    } catch (error) {
      return err(
        createValidationError(
          'Invalid capability configuration',
          error as Error
        )
      );
    }
  }

  async process(input: string): Promise<Result<ExecutionResult, Error>> {
    const messages = this.buildMessages(input);
    const tools = this.buildTools();

    const executionResult = await this.executor.execute({
      messages,
      model: this.config.model,
      temperature: this.config.configuration?.temperature,
      maxTokens: this.config.configuration?.maxTokens,
      tools,
    });

    if (executionResult.isErr()) {
      return err(executionResult.error);
    }

    const toolCalls = this.buildToolCalls(executionResult.value.messages);
    const toolResults = await this.handleToolCalls(toolCalls, {});

    if (toolResults.isErr()) {
      return err(toolResults.error);
    }

    return ok({
      messages: executionResult.value.messages,
      finish_reason: executionResult.value.finish_reason,
      usage: executionResult.value.usage,
    });
  }

  private buildMessages(input: string): Message[] {
    return [
      {
        role: 'system',
        content: this.config.systemPrompt,
      },
      {
        role: 'user',
        content: input,
      },
    ];
  }

  private buildTools() {
    return this.config.capabilities.map((capability) => ({
      function: async (args: Record<string, unknown>) => {
        return await capability.handler(args);
      },
      name: capability.name,
      description: capability.description,
      parameters: {
        type: 'object' as const, // Ensure this is a literal type
        properties: capability.parameters,
        required: Object.entries(capability.parameters)
          .filter(([_, param]) => param.required)
          .map(([name]) => name),
      },
      type: 'function' as const, // Ensure this is a literal type
    }));
  }

  private buildToolCalls(messages: Message[]): ToolCall[] {
    return messages.map((message) => ({
      function: {
        name: message.toolName || '',
        arguments: JSON.stringify({ content: message.content }),
      },
    }));
  }

  async executeCapability(
    name: string,
    params: Record<string, unknown>
  ): Promise<Result<unknown, CapabilityError>> {
    const capability = this.config.capabilities.find(
      (cap) => cap.name === name
    );

    if (!capability) {
      return err(createCapabilityError(`Capability "${name}" not found`));
    }

    try {
      const result = await capability.handler(params);
      return ok(result);
    } catch (error) {
      return err(
        createCapabilityError(
          `Failed to execute capability "${name}"`,
          error as Error
        )
      );
    }
  }

  async handleToolCalls(
    toolCalls: ToolCall[],
    contextVariables: ExecutionContext
  ): Promise<Result<unknown[], CapabilityError>> {
    const results: unknown[] = [];

    // Group tool calls into batches if needed (for example, by some criteria)
    const batchSize = 5; // Define a suitable batch size
    for (let i = 0; i < toolCalls.length; i += batchSize) {
      const batch = toolCalls.slice(i, i + batchSize);

      // Process each batch concurrently
      const batchResults = await Promise.all(
        batch.map(async (toolCall) => {
          const capability = this.config.capabilities.find(
            (cap) => cap.name === toolCall.function.name
          );

          if (!capability) {
            return err(
              new CapabilityError(
                `Capability "${toolCall.function.name}" not found`,
                {
                  code: ErrorCodes.CAPABILITY_NOT_FOUND,
                }
              )
            );
          }

          const args = JSON.parse(toolCall.function.arguments);
          if ('context_variables' in capability.handler) {
            args.context_variables = contextVariables;
          }

          try {
            const result = await capability.handler(args);
            return ok(result);
          } catch (error) {
            return err(
              createCapabilityError(
                `Failed to execute capability "${toolCall.function.name}"`,
                error as Error
              )
            );
          }
        })
      );

      // Collect results from the batch
      for (const result of batchResults) {
        if (result.isErr()) {
          return err(result.error);
        }
        results.push(result.value);
      }
    }

    return ok(results);
  }

  getConfig(): AgentConfig {
    return { ...this.config };
  }
}
