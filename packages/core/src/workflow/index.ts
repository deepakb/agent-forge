export * from './types';
export * from './workflow-engine';
export * from './workflow-builder';

import { LogManager } from '../logging';
import { BaseWorkflowEngine } from './workflow-engine';

// Create and export a default workflow engine instance
const defaultWorkflowEngine = new BaseWorkflowEngine(LogManager.createLogger('console'));

export { defaultWorkflowEngine };
