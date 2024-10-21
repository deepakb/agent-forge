// packages/core/src/errors/index.ts
import { AgentForgeError } from './base';
import {
  ConfigurationError,
  ExecutionError,
  ValidationError,
  CapabilityError,
  RateLimitError,
  NetworkError,
} from './types';
import { ErrorCodes, type ErrorCode } from './codes';

// Re-export everything
export {
  // Base error class
  AgentForgeError,

  // Specific error types
  ConfigurationError,
  ExecutionError,
  ValidationError,
  CapabilityError,
  RateLimitError,
  NetworkError,

  // Error codes
  ErrorCodes,
  type ErrorCode,
};

// Error helper functions
export function isAgentForgeError(error: unknown): error is AgentForgeError {
  return error instanceof AgentForgeError;
}

export function createError(
  ErrorClass: new (message: string, options?: ErrorOptions) => AgentForgeError,
  message: string,
  options?: ErrorOptions
): AgentForgeError {
  return new ErrorClass(message, options);
}

// Add type guard functions for specific error types
export function isConfigurationError(
  error: unknown
): error is ConfigurationError {
  return error instanceof ConfigurationError;
}

export function isExecutionError(error: unknown): error is ExecutionError {
  return error instanceof ExecutionError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isCapabilityError(error: unknown): error is CapabilityError {
  return error instanceof CapabilityError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

// Utility type for all possible error types
export type AnyAgentForgeError =
  | ConfigurationError
  | ExecutionError
  | ValidationError
  | CapabilityError
  | RateLimitError
  | NetworkError;

export * from './base';
export * from './types';
export * from './codes';
