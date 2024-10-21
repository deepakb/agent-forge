export const ErrorCodes = {
  // Configuration Errors (1xxx)
  INVALID_API_KEY: 'ERR_1001',
  INVALID_CONFIG: 'ERR_1002',
  MISSING_REQUIRED_FIELD: 'ERR_1003',

  // Execution Errors (2xxx)
  EXECUTION_FAILED: 'ERR_2001',
  TIMEOUT: 'ERR_2002',
  MODEL_NOT_AVAILABLE: 'ERR_2003',

  // Validation Errors (3xxx)
  INVALID_PARAMETER: 'ERR_3001',
  SCHEMA_VALIDATION_FAILED: 'ERR_3002',

  // Capability Errors (4xxx)
  CAPABILITY_NOT_FOUND: 'ERR_4001',
  INVALID_CAPABILITY: 'ERR_4002',
  CAPABILITY_EXECUTION_FAILED: 'ERR_4003',

  // Rate Limit Errors (5xxx)
  RATE_LIMIT_EXCEEDED: 'ERR_5001',
  QUOTA_EXCEEDED: 'ERR_5002',

  // Network Errors (6xxx)
  NETWORK_UNAVAILABLE: 'ERR_6001',
  REQUEST_FAILED: 'ERR_6002',
  RESPONSE_INVALID: 'ERR_6003',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
