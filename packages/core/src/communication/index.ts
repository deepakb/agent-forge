export * from './types';
export * from './message-bus';
export * from './utils';

// Create and export a default message bus instance
import { MessageBus } from './message-bus';
export const defaultMessageBus = new MessageBus();