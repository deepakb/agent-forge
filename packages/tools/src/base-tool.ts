import { Tool, ToolContext, ToolResult, ToolConfig } from './types';
import { defaultLogger, type Logger } from '@agent-forge/core';

export abstract class BaseTool implements Tool {
  public readonly name: string;
  public readonly description: string | undefined;
  public readonly category: string | undefined;
  protected logger: Logger;

  constructor(config: ToolConfig) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.logger = defaultLogger;
  }

  abstract execute(context: ToolContext): Promise<ToolResult>;

  protected async createSuccessResult<T>(data: T, metadata?: Record<string, unknown>): Promise<ToolResult<T>> {
    return {
      success: true,
      data: data,
      error: undefined,
      metadata: metadata
    };
  }

  protected async createErrorResult(error: Error): Promise<ToolResult> {
    return {
      success: false,
      data: undefined,
      error: error,
      metadata: undefined
    };
  }
}
