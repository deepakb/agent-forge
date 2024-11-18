import { Logger } from '../logging/logger';
import { StateListener, StateManager, StateTransition } from './types';

export class BaseStateManager implements StateManager {
  private states: Set<string> = new Set();
  private transitions: Map<string, StateTransition[]> = new Map();
  private currentState: string;
  private listeners: Set<StateListener> = new Set();
  private logger: Logger;

  constructor(initialState: string, logger: Logger) {
    this.currentState = initialState;
    this.states.add(initialState);
    this.logger = logger;
  }

  getCurrentState(): string {
    return this.currentState;
  }

  addState(state: string): void {
    this.states.add(state);
    this.logger.log('DEBUG', `State added: ${state}`);
  }

  addTransition(from: string, to: string, action?: () => void): void {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, []);
    }
    this.transitions.get(from)?.push({ from, to, action });
    this.logger.log('DEBUG', `Transition added: ${from} -> ${to}`);
  }

  transition(to: string): void {
    const possibleTransitions = this.transitions.get(this.currentState) || [];
    const transition = possibleTransitions.find(t => t.to === to);

    if (!transition) {
      this.logger.log('ERROR', `Invalid transition from ${this.currentState} to ${to}`);
      throw new Error(`Invalid transition from ${this.currentState} to ${to}`);
    }

    try {
      if (transition.action) {
        transition.action();
      }
      this.currentState = to;
      this.notifyListeners();
      this.logger.log('INFO', `State transitioned to: ${to}`);
    } catch (error) {
      this.logger.log('ERROR', 'Error during state transition', { error });
      throw error;
    }
  }

  subscribe(listener: StateListener): void {
    this.listeners.add(listener);
    this.logger.log('DEBUG', 'State listener subscribed');
  }

  unsubscribe(listener: StateListener): void {
    this.listeners.delete(listener);
    this.logger.log('DEBUG', 'State listener unsubscribed');
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener.onStateChange(this.currentState);
      } catch (error) {
        this.logger.log('ERROR', 'Error notifying state listener', { error });
      }
    });
  }
}
