import { RetryOptions } from './types';
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY, BACKOFF_FACTOR } from './constants';

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts || MAX_RETRY_ATTEMPTS;
  const delay = options.delay || RETRY_DELAY;
  const backoffFactor = options.backoffFactor || BACKOFF_FACTOR;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;
      
      const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
      await sleep(waitTime);
    }
  }
  
  throw lastError!;
}

export function memoize<T>(
  fn: (...args: any[]) => T,
  getKey: (...args: any[]) => string = (...args) => JSON.stringify(args)
): (...args: any[]) => T {
  const cache = new Map<string, T>();
  
  return (...args: any[]): T => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}
