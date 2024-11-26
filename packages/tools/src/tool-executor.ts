import { defaultLogger, type Logger } from '@agent-forge/core';
import { ToolContext, ToolResult, ToolError } from './types';
import { defaultToolRegistry } from './tool-registry';

export class ToolExecutor {
  private logger: Logger;

  constructor() {
    this.logger = defaultLogger;
  }

  async execute(toolName: string, context: ToolContext): Promise<ToolResult> {
    try {
      const tool = defaultToolRegistry.getTool(toolName);
      
      if (tool.validate) {
        const isValid = await tool.validate(context);
        if (!isValid) {
          throw new ToolError(
            `Validation failed for tool ${toolName}`,
            'VALIDATION_ERROR'
          );
        }
      }

      this.logger.log('INFO', `Executing tool: ${toolName}`);
      const result = await tool.execute(context);
      
      if (tool.cleanup) {
        await tool.cleanup();
      }

      return result;
    } catch (error) {
      this.logger.log('ERROR', `Tool execution failed: ${toolName}`, { error });
      throw error;
    }
  }

  async executeMany(tools: string[], context: ToolContext): Promise<ToolResult[]> {
    return Promise.all(tools.map(tool => this.execute(tool, context)));
  }
}

// Export a default executor instance
export const defaultToolExecutor = new ToolExecutor();
