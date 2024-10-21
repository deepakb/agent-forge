import OpenAI from 'openai';
import { Result, ok, err } from 'neverthrow';
import type {
  ExecutorConfig,
  Message,
  ExecutionResult,
  Stream,
  Tool,
  NonStreamingResponse,
} from '../types';
import {
  ExecutionError,
  NetworkError,
  RateLimitError,
  ErrorCodes,
  ValidationError,
} from '../errors';
import { ExecutorConfigSchema } from '../types';
import {
  createExecutionError,
  createNetworkError,
  createRateLimitError,
} from '../utils/errorUtils';

export class Executor {
  private client: OpenAI;
  private config: ExecutorConfig;

  constructor(config: ExecutorConfig) {
    try {
      this.config = ExecutorConfigSchema.parse(config);
    } catch (error) {
      throw new ValidationError('Invalid executor configuration', {
        code: ErrorCodes.INVALID_CONFIG,
        cause: error as Error,
      });
    }

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      organization: this.config.organizationId,
      baseURL: this.config.baseURL,
      timeout: this.config.timeoutMs,
      maxRetries: this.config.maxRetries,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private debugLog(message: string, data?: unknown) {
    if (this.config.debug) {
      console.debug(`[AgentForge Executor] ${message}`, data ?? '');
    }
  }

  private isStream(
    response: unknown
  ): response is Stream<OpenAI.Chat.Completions.ChatCompletionChunk> {
    return (
      typeof (response as { [Symbol.asyncIterator]?: unknown })[
        Symbol.asyncIterator
      ] === 'function'
    );
  }

  async execute({
    messages,
    model,
    temperature,
    maxTokens,
    tools,
    stream,
  }: {
    messages: Message[];
    model: string;
    temperature?: number;
    maxTokens?: number;
    tools?: Array<Tool>;
    stream?: boolean;
  }): Promise<
    Result<ExecutionResult, ExecutionError | NetworkError | RateLimitError>
  > {
    this.debugLog('Executing with params:', {
      messages,
      model,
      temperature,
      maxTokens,
      tools,
      stream,
    });

    // Transform tools to match OpenAI's expected structure
    const openAITools:
      | OpenAI.Chat.Completions.ChatCompletionTool[]
      | undefined = tools?.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: tool.parameters.properties, // Ensure this matches the expected structure
        required: tool.parameters.required || [], // Include required parameters if any
      },
      function: tool.function, // Include the function to execute
      type: 'function', // Specify the type of the tool
    }));

    try {
      const response = await this.client.chat.completions.create({
        messages: messages as OpenAI.ChatCompletionMessageParam[],
        model,
        temperature,
        max_tokens: maxTokens,
        tools: openAITools,
        stream,
      });

      return this.isStream(response)
        ? await this.handleStreamingResponse(response)
        : this.handleNonStreamingResponse(response);
    } catch (error: unknown) {
      return this.handleExecutionError(error);
    }
  }

  private async handleStreamingResponse(
    response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): Promise<Result<ExecutionResult, ExecutionError>> {
    const result: ExecutionResult = {
      messages: [],
      finish_reason: 'length',
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };

    for await (const chunk of response) {
      if ('choices' in chunk) {
        const choice = chunk.choices[0];
        if (choice.delta.content) {
          result.messages.push({
            role: choice.delta.role || 'assistant',
            content: choice.delta.content ?? '',
          });
        }
        result.finish_reason = choice.finish_reason || 'stop';

        this.debugLog('Streaming chunk received:', result);
      }
    }

    this.debugLog('Streaming completed:', result);
    return ok(result);
  }

  private handleNonStreamingResponse(
    response: unknown
  ): Result<ExecutionResult, ExecutionError> {
    if (isNonStreamingResponse(response)) {
      const choice = response.choices[0];
      const result: ExecutionResult = {
        messages: [
          {
            role: choice.message.role as
              | 'system'
              | 'user'
              | 'assistant'
              | 'tool', // Type assertion for role
            content: choice.message.content ?? '',
          },
        ],
        finish_reason: choice.finish_reason as
          | 'length'
          | 'stop'
          | 'tool_calls'
          | 'content_filter'
          | 'function_call', // Type assertion for finish_reason
        usage: response.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      };

      this.debugLog('Execution completed:', result);
      return ok(result);
    } else {
      this.debugLog('Received an unexpected response format.');
      return err(createExecutionError('Unexpected response format'));
    }
  }

  private handleExecutionError(
    error: unknown
  ): Result<ExecutionResult, ExecutionError | NetworkError | RateLimitError> {
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 429:
          return err(createRateLimitError('Rate limit exceeded', error));
        case 500:
        case 503:
          return err(createNetworkError('Service unavailable', error));
        default:
          return err(createExecutionError('Execution failed', error));
      }
    }

    return err(
      createExecutionError(
        'Unknown error occurred',
        error instanceof Error ? error : new Error(String(error))
      )
    );
  }
}

// Type guard function to check if the response is of type NonStreamingResponse
function isNonStreamingResponse(
  response: unknown
): response is NonStreamingResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'choices' in response &&
    Array.isArray((response as NonStreamingResponse).choices) &&
    (response as NonStreamingResponse).choices.length > 0 &&
    'message' in (response as NonStreamingResponse).choices[0] &&
    'role' in (response as NonStreamingResponse).choices[0].message &&
    'content' in (response as NonStreamingResponse).choices[0].message
  );
}
