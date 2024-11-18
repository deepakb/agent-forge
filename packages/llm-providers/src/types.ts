export interface LLMConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  retryAttempts?: number;
}

export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, unknown>;
}

export interface LLMRequest {
  prompt: string;
  options?: {
    maxTokens?: number;
    temperature?: number;
    stop?: string[];
  };
}

export interface LLMProvider {
  initialize(): Promise<void>;
  generate(request: LLMRequest): Promise<LLMResponse>;
  reset(): Promise<void>;
}

export enum LLMProviderType {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Google = 'google',
  Custom = 'custom'
}

export class LLMError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string
  ) {
    super(message);
    this.name = 'LLMError';
  }
}
