export type WorkflowStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface WorkflowStep {
  name: string;
  execute: (data: any) => Promise<any>;
  validate?: (data: any) => Promise<boolean>;
  rollback?: (data: any) => Promise<void>;
}

export interface WorkflowContext {
  [key: string]: any;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  context: WorkflowContext;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: WorkflowStatus) => void;
}

export interface WorkflowExecutionResult {
  workflowId: string;
  status: WorkflowStatus;
  context: WorkflowContext;
  error?: Error;
  completedSteps: string[];
}

export interface WorkflowEngine {
  executeWorkflow(workflow: Workflow): Promise<WorkflowExecutionResult>;
  pauseWorkflow(workflowId: string): Promise<void>;
  resumeWorkflow(workflowId: string): Promise<void>;
  cancelWorkflow(workflowId: string): Promise<void>;
  getWorkflowStatus(workflowId: string): WorkflowStatus;
}

export interface WorkflowBuilder {
  setName(name: string): WorkflowBuilder;
  setDescription(description: string): WorkflowBuilder;
  addStep(step: WorkflowStep): WorkflowBuilder;
  setContext(context: WorkflowContext): WorkflowBuilder;
  build(): Workflow;
}
