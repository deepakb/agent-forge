import { defaultLogger, type Logger } from '@agent-forge/core';
import { Tool, ToolError } from './types';

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = defaultLogger;
  }

  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new ToolError(
        `Tool ${tool.name} is already registered`,
        'DUPLICATE_TOOL'
      );
    }

    this.tools.set(tool.name, tool);
    this.logger.log('INFO', `Tool registered: ${tool.name}`);
  }

  unregister(toolName: string): void {
    if (this.tools.delete(toolName)) {
      this.logger.log('INFO', `Tool unregistered: ${toolName}`);
    }
  }

  getTool(name: string): Tool {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new ToolError(
        `Tool ${name} not found`,
        'TOOL_NOT_FOUND'
      );
    }
    return tool;
  }

  getToolsByCategory(category: string): Tool[] {
    return Array.from(this.tools.values())
      .filter(tool => tool.category === category);
  }

  listTools(): string[] {
    return Array.from(this.tools.keys());
  }
}

// Export a default registry instance
export const defaultToolRegistry = new ToolRegistry();
