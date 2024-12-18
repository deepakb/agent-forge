// Export core types and interfaces first
export type { Logger, LogLevel, LogTransport } from './logger';

// Export implementations and utilities
export * from './log-manager';
export * from './transports/console';
export * from './transports/file';
export * from './transports/http';
export * from './utils/formatter';

// Default logger setup
import { LogManager } from './log-manager';

const defaultLogger = LogManager.createLogger('console');

export { defaultLogger };
