export class AgentForgeError extends Error {
  public readonly code: string;
  public readonly cause?: Error;
  public readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    options?: {
      code?: string;
      cause?: Error;
      metadata?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = 'AgentForgeError';
    this.code = options?.code ?? 'UNKNOWN_ERROR';
    this.cause = options?.cause;
    this.metadata = options?.metadata;

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      metadata: this.metadata,
      stack: this.stack,
      cause: this.cause instanceof Error ? this.cause.message : this.cause,
    };
  }
}
