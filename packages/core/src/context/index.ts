export * from './types';
export * from './context-manager';
export * from './state-manager';

import { LogManager } from '../logging/log-manager';
import { BaseContextManager } from './context-manager';
import { BaseStateManager } from './state-manager';

// Create default instances with console logging
const defaultContextManager = new BaseContextManager(LogManager.createLogger('console'));
const defaultStateManager = new BaseStateManager('INITIAL', LogManager.createLogger('console'));

export { defaultContextManager, defaultStateManager };
