import { z } from 'zod';

// Core configuration types
export const ExecutorConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  organizationId: z.string().optional(),
  baseURL: z.string().optional(),
  timeoutMs: z.number().optional().default(30000),
  maxRetries: z.number().optional().default(3),
  debug: z.boolean().optional().default(false),
});

export type ExecutorConfig = z.infer<typeof ExecutorConfigSchema>;

// Define the CapabilityParameter type based on the schema
export type CapabilityParameter = {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  enum?: string[];
  items?: CapabilityParameter; // For array types, it can reference itself
  properties?: Record<string, CapabilityParameter>; // For object types
};

// Capability types
export const CapabilityParameterSchema: z.ZodType<CapabilityParameter> =
  z.object({
    type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
    description: z.string(),
    required: z.boolean().default(false),
    enum: z.array(z.string()).optional(),
    items: z.lazy(() => CapabilityParameterSchema).optional(), // For array types
    properties: z.record(z.lazy(() => CapabilityParameterSchema)).optional(), // For object types
  });

export const CapabilitySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    parameters: z.record(CapabilityParameterSchema),
    handler: z
      .function()
      .args(z.record(z.unknown()))
      .returns(z.promise(z.unknown())), // Change to unknown
    metadata: z.record(z.unknown()).optional(),
  })
  .refine((data) => data.name.length > 0, {
    message: 'Name must not be empty', // Added validation message
  });

export type Capability = z.infer<typeof CapabilitySchema>;

// Agent types
export const AgentConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  model: z.string(),
  systemPrompt: z.string(),
  capabilities: z.array(CapabilitySchema).default([]),
  configuration: z
    .object({
      temperature: z.number().min(0).max(2).optional().default(0.7),
      maxTokens: z.number().optional(),
      topP: z.number().min(0).max(1).optional(),
      presencePenalty: z.number().min(-2).max(2).optional(),
      frequencyPenalty: z.number().min(-2).max(2).optional(),
      parallelCapabilities: z.boolean().optional().default(true),
    })
    .optional()
    .default({}),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Message types
export const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string(),
  name: z.string().optional(),
  toolCallId: z.string().optional(),
  toolName: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// Response types
export const ExecutionResultSchema = z.object({
  messages: z.array(MessageSchema),
  finish_reason: z.enum([
    'stop',
    'length',
    'tool_calls',
    'content_filter',
    'function_call',
  ]),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export type ExecutionResult = z.infer<typeof ExecutionResultSchema>;

export interface Stream<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>;
}

// Define the Tool type based on OpenAI's expected structure
export const ToolSchema = z.object({
  function: z
    .function()
    .args(z.record(z.unknown()))
    .returns(z.promise(z.unknown())), // Change to unknown
  name: z.string(), // The name of the tool
  description: z.string(), // A brief description of what the tool does
  parameters: z.object({
    type: z.literal('object'), // Tools are expected to have an object type for parameters
    properties: z.record(z.unknown()), // Change to unknown
    required: z.array(z.string()).optional(), // List of required parameter names
  }),
  type: z.literal('function'), // Specify the type of the tool
});

// Type inference from the schema
export type Tool = z.infer<typeof ToolSchema>;

export type ToolCall = {
  function: {
    name: string;
    arguments: string;
  };
};

export type ExecutionContext = {
  [key: string]: unknown; // Change to unknown
};

export interface NonStreamingResponse {
  choices: Array<{
    message: {
      role: string;
      content: string | null;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
