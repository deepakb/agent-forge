import { Logger } from '../logging/logger';
import { Context, ContextListener, ContextManager } from './types';

export class BaseContextManager implements ContextManager {
  private context: Context = {};
  private listeners: Map<string, Set<ContextListener>> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  getContext(key: string): any {
    this.logger.log('DEBUG', `Getting context for key: ${key}`);
    return this.context[key];
  }

  setContext(key: string, value: any): void {
    this.context[key] = value;
    this.logger.log('DEBUG', `Context updated for key: ${key}`, { value });
    this.notifyListeners(key, value);
  }

  subscribe(key: string, listener: ContextListener): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(listener);
    this.logger.log('DEBUG', `Subscribed to context changes for key: ${key}`);
  }

  unsubscribe(key: string, listener: ContextListener): void {
    this.listeners.get(key)?.delete(listener);
    this.logger.log('DEBUG', `Unsubscribed from context changes for key: ${key}`);
  }

  private notifyListeners(key: string, value: any): void {
    this.listeners.get(key)?.forEach(listener => {
      try {
        listener.onContextChange(key, value);
      } catch (error) {
        this.logger.log('ERROR', 'Error notifying context listener', { error });
      }
    });
  }
}
