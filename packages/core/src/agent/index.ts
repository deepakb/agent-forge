export * from './types';
export * from './base-agent';
export * from './agent-factory';
export * from './simple-agent';

import { DefaultAgentFactory } from './agent-factory';

// Export a default agent factory instance
export const defaultAgentFactory = new DefaultAgentFactory();
