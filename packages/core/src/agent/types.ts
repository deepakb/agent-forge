import { Context } from '../context/types';

export interface AgentAction {
  execute(context: Context): Promise<Context>;
}

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  maxRetries?: number;
  timeout?: number;
}

export interface Agent {
  id: string;
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  addAction(action: AgentAction): void;
  execute(context: Context): Promise<Context>;
}

export enum AgentType {
  Simple = 'Simple',
  Autonomous = 'Autonomous',
  Reactive = 'Reactive',
  Collaborative = 'Collaborative'
}

export interface AgentFactory {
  createAgent(type: AgentType, config: AgentConfig): Agent;
}
