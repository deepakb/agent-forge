// error-strategy.ts

import { BaseError } from './base-error';
import { LogManager } from '../logging/log-manager';
import type { Logger } from '../logging/logger';

/**
 * Interface defining an error-handling strategy.
 * Each strategy must implement the `shouldHandle` and `handle` methods.
 */
export interface ErrorStrategy {
  shouldHandle(error: BaseError): boolean;
  handle(error: BaseError): void;
}

/**
 * Abstract base class for error strategies providing common logging functionality
 */
abstract class BaseErrorStrategy implements ErrorStrategy {
  protected logger: Logger;

  constructor(loggerType: 'console' | 'file' | 'http' = 'console', config?: any) {
    this.logger = LogManager.createLogger(loggerType, config);
  }

  abstract shouldHandle(error: BaseError): boolean;
  abstract handle(error: BaseError): void;

  protected logError(level: 'ERROR' | 'FATAL', error: BaseError): void {
    this.logger.log(level, `${error.name}: ${error.message}`, {
      code: error.code,
      details: error.details,
      context: error.context,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Default Error Strategy for logging errors.
 */
export class LogErrorStrategy extends BaseErrorStrategy {
  shouldHandle(error: BaseError): boolean {
    // Log all errors (customize logic as needed)
    return true;
  }

  handle(error: BaseError): void {
    this.logError('ERROR', error);
  }
}

/**
 * Strategy to send notifications (e.g., via email) for critical errors.
 */
export class NotifyErrorStrategy extends BaseErrorStrategy {
  constructor(config?: any) {
    // Use HTTP transport for notification logging
    super('http', config);
  }

  shouldHandle(error: BaseError): boolean {
    return error.code === 'FATAL';
  }

  handle(error: BaseError): void {
    this.logError('FATAL', error);
    // Simulating sending an email notification
    // In a real implementation, you might want to use a separate notification service
    console.log(`Sending notification for error: ${error.message}`);
  }
}

/**
 * Retry Error Strategy for retrying transient errors (e.g., network-related errors).
 */
export class RetryErrorStrategy extends BaseErrorStrategy {
  private maxRetries: number;
  private currentRetry: number = 0;

  constructor(maxRetries: number = 3, config?: any) {
    super('console', config);
    this.maxRetries = maxRetries;
  }

  shouldHandle(error: BaseError): boolean {
    return error.code === 'NETWORK_ERROR' && this.currentRetry < this.maxRetries;
  }

  handle(error: BaseError): void {
    this.currentRetry++;
    this.logger.log('WARN', `Retry attempt ${this.currentRetry}/${this.maxRetries}`, {
      error: error.message,
      code: error.code,
      attempt: this.currentRetry,
      maxRetries: this.maxRetries
    });

    if (this.currentRetry === this.maxRetries) {
      this.logError('ERROR', error);
    }
    
    // Implement retry logic here
    // For example:
    // setTimeout(() => this.retryOperation(), this.getBackoffTime());
  }

  private getBackoffTime(): number {
    // Implement exponential backoff
    return Math.min(1000 * Math.pow(2, this.currentRetry - 1), 10000);
  }

  // Reset retry counter when needed
  reset(): void {
    this.currentRetry = 0;
  }
}

// Example usage of composite error strategy
export class CompositeErrorStrategy implements ErrorStrategy {
  private strategies: ErrorStrategy[] = [];

  addStrategy(strategy: ErrorStrategy): void {
    this.strategies.push(strategy);
  }

  shouldHandle(error: BaseError): boolean {
    return this.strategies.some(strategy => strategy.shouldHandle(error));
  }

  handle(error: BaseError): void {
    this.strategies.forEach(strategy => {
      if (strategy.shouldHandle(error)) {
        strategy.handle(error);
      }
    });
  }
}
