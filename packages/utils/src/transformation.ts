import { TransformOptions } from './types';

export function toCamelCase(str: string, options?: TransformOptions): string {
  if (!str) return str;
  
  const words = str.split(/[\s_-]/g);
  const firstWord = options?.preserveCase ? words[0] : words[0].toLowerCase();
  const restWords = words.slice(1).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  
  return [firstWord, ...restWords].join('');
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function normalizeString(str: string, options?: TransformOptions): string {
  let result = str.trim();
  
  if (options?.stripSpecialChars) {
    result = result.replace(/[^a-zA-Z0-9\s]/g, '');
  }
  
  if (options?.truncateLength) {
    result = truncate(result, options.truncateLength);
  }
  
  return result;
}
