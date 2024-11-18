import { Logger, LogManager } from '@core/logging';
import { LLMProvider, LLMProviderType, LLMError } from './types';

export class ProviderRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = LogManager.createLogger('console');
  }

  registerProvider(type: LLMProviderType, provider: LLMProvider): void {
    if (this.providers.has(type)) {
      throw new LLMError(
        `Provider ${type} is already registered`,
        'DUPLICATE_PROVIDER'
      );
    }

    this.providers.set(type, provider);
    this.logger.log('INFO', `Provider registered successfully`, { type });
  }

  getProvider(type: LLMProviderType): LLMProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new LLMError(
        `Provider ${type} not found`,
        'PROVIDER_NOT_FOUND'
      );
    }
    return provider;
  }

  hasProvider(type: LLMProviderType): boolean {
    return this.providers.has(type);
  }

  removeProvider(type: LLMProviderType): void {
    if (this.providers.delete(type)) {
      this.logger.log('INFO', `Provider removed successfully`, { type });
    }
  }

  getAllProviders(): Map<string, LLMProvider> {
    return new Map(this.providers);
  }
}
