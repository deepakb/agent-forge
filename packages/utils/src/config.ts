import { ConfigOptions } from './types';
import { ENVIRONMENTS } from './constants';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ConfigOptions;

  private constructor() {
    this.config = {
      environment: process.env['NODE_ENV'] as 'development' | 'staging' | 'production' || ENVIRONMENTS.DEVELOPMENT,
      debug: process.env['DEBUG'] === 'true',
      timeout: parseInt(process.env['TIMEOUT'] || '5000'),
      retryAttempts: parseInt(process.env['RETRY_ATTEMPTS'] || '3')
    };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): ConfigOptions {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<ConfigOptions>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
  }

  public getEnvironment(): string {
    return this.config.environment;
  }

  public isDebugMode(): boolean {
    return !!this.config.debug;
  }
}

export const configManager = ConfigManager.getInstance();
