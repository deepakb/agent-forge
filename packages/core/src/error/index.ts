// Export base error and types
export { BaseError } from './base-error';

// Export error strategies
export {
  ErrorStrategy,
  LogErrorStrategy,
  NotifyErrorStrategy,
  RetryErrorStrategy,
  CompositeErrorStrategy,
} from './error-strategy';

// Export default error handler instance
import { CompositeErrorStrategy, LogErrorStrategy } from './error-strategy';

// Create a default error handler with basic logging strategy
const defaultErrorHandler = new CompositeErrorStrategy();
defaultErrorHandler.addStrategy(new LogErrorStrategy());

export { defaultErrorHandler };
