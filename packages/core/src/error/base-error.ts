// base-error.ts

/**
 * Base class for all errors, extending the native Error class.
 * Provides custom properties like code, details, and context for rich error information.
 */
export class BaseError extends Error {
    code: string;      // Error code (e.g., 'DB_CONN_ERROR')
    details: string;   // Additional details about the error (optional)
    context: any;      // Additional context (optional)
  
    constructor(message: string, code: string, details: string = '', context: any = {}) {
      super(message);
      this.code = code;
      this.details = details;
      this.context = context;
      this.name = this.constructor.name;
  
      // Capturing the stack trace for better debugging
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, BaseError);
      }
    }
  }
  