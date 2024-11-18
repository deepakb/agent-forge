// error-handler.ts

import { BaseError } from './base-error';
import { ErrorStrategy } from './error-strategy';

/**
 * The main error handler class that uses strategies to handle errors.
 */
export class ErrorHandler {
  private strategy: ErrorStrategy;

  constructor(strategy: ErrorStrategy) {
    this.strategy = strategy;
  }

  /**
   * Set the error handling strategy dynamically.
   * @param strategy The error strategy to set.
   */
  setStrategy(strategy: ErrorStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Handle the error using the current strategy.
   * @param error The error to handle.
   */
  handle(error: BaseError): void {
    if (this.strategy.shouldHandle(error)) {
      this.strategy.handle(error);
    } else {
      console.error(`Unhandled error: ${error.message}`);
    }
  }
}
