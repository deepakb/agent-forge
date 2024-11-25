export interface ToolConfig {
  name: string;
  description?: string;
  version?: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolContext {
  [key: string]: any;
}

export interface ToolResult<T = any> {
  success: boolean;
  data?: T | undefined;
  error?: Error | undefined;
  metadata?: Record<string, unknown> | undefined;
}

export interface Tool {
  readonly name: string;
  readonly description: string | undefined;
  readonly category: string | undefined;
  
  execute(context: ToolContext): Promise<ToolResult>;
  validate?(context: ToolContext): Promise<boolean>;
  cleanup?(): Promise<void>;
}

export interface ToolFactory {
  createTool(config: ToolConfig): Tool;
}

export class ToolError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string
  ) {
    super(message);
    this.name = 'ToolError';
  }
}
