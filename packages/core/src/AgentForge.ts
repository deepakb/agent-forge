import { Result, ok, err } from 'neverthrow';
import { Agent } from './agent';
import { Executor } from './executor';
import type { ExecutorConfig, AgentConfig } from './types';
import { ValidationError, ErrorCodes } from './errors';
import { ExecutorConfigSchema } from './types';

export class AgentForge {
  private executor: Executor;

  constructor(config: ExecutorConfig) {
    try {
      const validatedConfig = ExecutorConfigSchema.parse(config);
      this.executor = new Executor(validatedConfig);
    } catch (error) {
      throw new ValidationError('Invalid AgentForge configuration', {
        code: ErrorCodes.INVALID_CONFIG,
        cause: error as Error,
      });
    }
  }

  createAgent(config: AgentConfig): Result<Agent, ValidationError> {
    try {
      const agent = new Agent(config, this.executor);
      return ok(agent);
    } catch (error) {
      if (error instanceof ValidationError) {
        return err(error);
      }
      return err(
        new ValidationError('Failed to create agent', {
          code: ErrorCodes.INVALID_CONFIG,
          cause: error as Error,
        })
      );
    }
  }
}
