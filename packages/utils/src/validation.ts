import { ValidationResult } from './types';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function validateRequired(value: unknown): ValidationResult {
  const isValid = value !== undefined && value !== null && value !== '';
  return {
    isValid,
    errors: isValid ? undefined : ['Value is required']
  };
}

export function validateLength(value: string, min: number, max: number): ValidationResult {
  const isValid = value.length >= min && value.length <= max;
  return {
    isValid,
    errors: isValid ? undefined : [`Length must be between ${min} and ${max} characters`]
  };
}

export function validatePattern(value: string, pattern: RegExp): ValidationResult {
  const isValid = pattern.test(value);
  return {
    isValid,
    errors: isValid ? undefined : ['Value does not match required pattern']
  };
}
