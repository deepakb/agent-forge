import { Logger } from '@core/logging';
import { LLMConfig, LLMProvider, LLMRequest, LLMResponse, LLMError } from './types';

export abstract class BaseLLMProvider implements LLMProvider {
  protected config: LLMConfig;
  protected logger: Logger;
  protected isInitialized: boolean = false;

  constructor(config: LLMConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  abstract initialize(): Promise<void>;
  abstract generate(request: LLMRequest): Promise<LLMResponse>;

  async reset(): Promise<void> {
    this.isInitialized = false;
    this.logger.log('INFO', 'Provider reset completed');
  }

  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new LLMError(
        'API key is required',
        'INVALID_CONFIG',
        'No API key provided in configuration'
      );
    }

    if (!this.config.model) {
      throw new LLMError(
        'Model is required',
        'INVALID_CONFIG',
        'No model specified in configuration'
      );
    }
  }

  protected validateInitialization(): void {
    if (!this.isInitialized) {
      throw new LLMError(
        'Provider not initialized',
        'NOT_INITIALIZED',
        'Call initialize() before using the provider'
      );
    }
  }
}
