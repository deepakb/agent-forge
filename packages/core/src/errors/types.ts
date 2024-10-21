import { AgentForgeError } from './base';

export type ErrorOptions = {
  code?: string;
  cause?: Error;
  metadata?: Record<string, unknown>;
};

export class ConfigurationError extends AgentForgeError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      code: options?.code ?? 'CONFIGURATION_ERROR',
      cause: options?.cause,
      metadata: options?.metadata,
    });
    this.name = 'ConfigurationError';
  }
}

export class ExecutionError extends AgentForgeError {
  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: Error;
      metadata?: Record<string, unknown>;
    }
  ) {
    super(message, {
      code: options?.code ?? 'EXECUTION_ERROR',
      cause: options?.cause,
      metadata: options?.metadata,
    });
    this.name = 'ExecutionError';
  }
}

export class ValidationError extends AgentForgeError {
  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: Error;
      metadata?: Record<string, unknown>;
    }
  ) {
    super(message, {
      code: options?.code ?? 'VALIDATION_ERROR',
      cause: options?.cause,
      metadata: options?.metadata,
    });
    this.name = 'ValidationError';
  }
}

export class CapabilityError extends AgentForgeError {
  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: Error;
      metadata?: Record<string, unknown>;
    }
  ) {
    super(message, {
      code: options?.code ?? 'CAPABILITY_ERROR',
      cause: options?.cause,
      metadata: options?.metadata,
    });
    this.name = 'CapabilityError';
  }
}

export class RateLimitError extends AgentForgeError {
  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: Error;
      metadata?: Record<string, unknown>;
    }
  ) {
    super(message, {
      code: options?.code ?? 'RATE_LIMIT_ERROR',
      cause: options?.cause,
      metadata: options?.metadata,
    });
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends AgentForgeError {
  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: Error;
      metadata?: Record<string, unknown>;
    }
  ) {
    super(message, {
      code: options?.code ?? 'NETWORK_ERROR',
      cause: options?.cause,
      metadata: options?.metadata,
    });
    this.name = 'NetworkError';
  }
}
