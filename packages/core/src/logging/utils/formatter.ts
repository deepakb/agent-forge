/**
 * The module provides utility functions to format logs
 * in a structured way with timestamps, log levels, etc.
 */

// Enum for log levels
export enum LogLevel {
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL'
  }
  
  // Log format structure
  export interface LogMessage {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
  }
  
  /**
   * Formatter function to format log messages with a timestamp and level.
   * This can be expanded with custom logic to include other context.
   * 
   * @param log The log message object to format.
   * @returns The formatted log message as a string.
   */
  export function defaultLogFormatter(log: LogMessage): string {
    const { level, message, timestamp, context } = log;
    
    // Format the context if provided
    const formattedContext = context ? JSON.stringify(context) : '';
  
    return `[${timestamp}] ${level}: ${message} ${formattedContext ? `| Context: ${formattedContext}` : ''}`;
  }
  
  /**
   * Custom formatter to format the log message with a different structure.
   * For example, users can override this method to suit their needs.
   * 
   * @param log The log message object to format.
   * @returns The formatted log message as a string.
   */
  export function customLogFormatter(log: LogMessage): string {
    const { level, message, timestamp, context } = log;
    return `${level} | ${timestamp} | ${message} ${context ? `| Context: ${JSON.stringify(context)}` : ''}`;
  }
  
  /**
   * Utility function to get the current timestamp in ISO 8601 format.
   * This ensures consistent timestamp format across the package.
   * 
   * @returns The current timestamp string.
   */
  export function getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
  