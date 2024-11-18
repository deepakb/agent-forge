export interface ConfigOptions {
  environment: 'development' | 'staging' | 'production';
  debug?: boolean;
  timeout?: number;
  retryAttempts?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface TransformOptions {
  preserveCase?: boolean;
  stripSpecialChars?: boolean;
  truncateLength?: number;
}

export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoffFactor?: number;
  timeout?: number;
}
