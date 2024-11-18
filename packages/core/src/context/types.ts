export interface Context {
  [key: string]: any;
}

export interface ContextListener {
  onContextChange: (key: string, value: any) => void;
}

export interface StateListener {
  onStateChange: (state: string) => void;
}

export interface StateTransition {
  from: string;
  to: string;
  action?: () => void;
}

export interface ContextManager {
  getContext(key: string): any;
  setContext(key: string, value: any): void;
  subscribe(key: string, listener: ContextListener): void;
  unsubscribe(key: string, listener: ContextListener): void;
}

export interface StateManager {
  getCurrentState(): string;
  transition(to: string): void;
  addState(state: string): void;
  addTransition(from: string, to: string, action?: () => void): void;
  subscribe(listener: StateListener): void;
  unsubscribe(listener: StateListener): void;
}
