import {
  ValidationError,
  CapabilityError,
  ExecutionError,
  RateLimitError,
  NetworkError,
} from '../errors';
import { ErrorCodes } from '../errors/codes';

type ErrorOptions = {
  code?: string;
  cause?: Error;
  metadata?: Record<string, unknown>;
};

export function createError<T extends Error>(
  ErrorClass: new (message: string, options?: ErrorOptions) => T,
  message: string,
  options?: ErrorOptions
): T {
  return new ErrorClass(message, {
    code: options?.code,
    cause: options?.cause,
    metadata: options?.metadata,
  });
}

// Specific error creation functions
export function createValidationError(
  message: string,
  cause?: Error
): ValidationError {
  return createError(ValidationError, message, {
    code: ErrorCodes.INVALID_CONFIG,
    cause,
  });
}

export function createCapabilityError(
  message: string,
  cause?: Error
): CapabilityError {
  return createError(CapabilityError, message, {
    code: ErrorCodes.CAPABILITY_EXECUTION_FAILED,
    cause,
  });
}

export function createExecutionError(
  message: string,
  cause?: Error
): ExecutionError {
  return createError(ExecutionError, message, {
    code: ErrorCodes.EXECUTION_FAILED,
    cause,
  });
}

export function createRateLimitError(
  message: string,
  cause?: Error
): RateLimitError {
  return createError(RateLimitError, message, {
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
    cause,
  });
}

export function createNetworkError(
  message: string,
  cause?: Error
): NetworkError {
  return createError(NetworkError, message, {
    code: ErrorCodes.NETWORK_UNAVAILABLE,
    cause,
  });
}
