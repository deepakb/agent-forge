import { Logger } from '@core/logging';
import { BaseLLMProvider } from '../base-provider';
import { LLMConfig, LLMRequest, LLMResponse, LLMError } from '../types';
import axios, { AxiosInstance } from 'axios';

export class OpenAIProvider extends BaseLLMProvider {
  private client: AxiosInstance;

  constructor(config: LLMConfig, logger: Logger) {
    super(config, logger);
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async initialize(): Promise<void> {
    try {
      this.validateConfig();
      this.logger.log('INFO', 'Initializing OpenAI provider', { model: this.config.model });
      
      // Test the connection
      await this.client.get('/models');
      
      this.isInitialized = true;
      this.logger.log('INFO', 'OpenAI provider initialized successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new LLMError(
        `Failed to initialize OpenAI provider: ${message}`,
        'INITIALIZATION_ERROR'
      );
    }
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    try {
      this.validateInitialization();
      
      const response = await this.client.post('/completions', {
        model: this.config.model,
        prompt: request.prompt,
        max_tokens: request.options?.maxTokens || this.config.maxTokens || 100,
        temperature: request.options?.temperature || this.config.temperature || 0.7,
        stop: request.options?.stop
      });

      return {
        text: response.data.choices[0].text.trim(),
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens
        },
        metadata: {
          model: this.config.model,
          provider: 'openai'
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new LLMError(
        `OpenAI generation failed: ${message}`,
        'GENERATION_ERROR'
      );
    }
  }
}
