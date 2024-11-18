import { Logger } from '../logging/logger';
import { BaseError } from '../error/base-error';
import { generateMessageId } from '../communication/utils';
import {
  Workflow,
  WorkflowEngine,
  WorkflowExecutionResult,
  WorkflowStatus
} from './types';

export class WorkflowExecutionError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 'WORKFLOW_ERROR', details);
  }
}

export class BaseWorkflowEngine implements WorkflowEngine {
  private activeWorkflows: Map<string, Workflow> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async executeWorkflow(workflow: Workflow): Promise<WorkflowExecutionResult> {
    const workflowId = workflow.id || generateMessageId();
    this.activeWorkflows.set(workflowId, { ...workflow, id: workflowId });

    const result: WorkflowExecutionResult = {
      workflowId,
      status: 'RUNNING',
      context: workflow.context,
      completedSteps: []
    };

    try {
      this.updateWorkflowStatus(workflow, 'RUNNING');
      
      if (workflow.onStart) {
        workflow.onStart();
      }

      for (const step of workflow.steps) {
        this.logger.log('INFO', `Executing step: ${step.name}`, { workflowId });

        if (step.validate) {
          const isValid = await step.validate(workflow.context);
          if (!isValid) {
            throw new WorkflowExecutionError(`Validation failed for step: ${step.name}`);
          }
        }

        workflow.context = await step.execute(workflow.context);
        result.completedSteps.push(step.name);
      }

      this.updateWorkflowStatus(workflow, 'COMPLETED');
      
      if (workflow.onComplete) {
        workflow.onComplete();
      }

      result.status = 'COMPLETED';
      result.context = workflow.context;

      return result;
    } catch (error: any) {
      const workflowError = new WorkflowExecutionError(
        `Workflow execution failed: ${error.message}`,
        error.stack
      );

      this.updateWorkflowStatus(workflow, 'FAILED');
      
      if (workflow.onError) {
        workflow.onError(workflowError);
      }

      result.status = 'FAILED';
      result.error = workflowError;

      throw workflowError;
    } finally {
      this.activeWorkflows.delete(workflowId);
    }
  }

  async pauseWorkflow(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new WorkflowExecutionError(`Workflow not found: ${workflowId}`);
    }
    this.updateWorkflowStatus(workflow, 'PENDING');
  }

  async resumeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new WorkflowExecutionError(`Workflow not found: ${workflowId}`);
    }
    this.updateWorkflowStatus(workflow, 'RUNNING');
  }

  async cancelWorkflow(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new WorkflowExecutionError(`Workflow not found: ${workflowId}`);
    }
    this.updateWorkflowStatus(workflow, 'CANCELLED');
    this.activeWorkflows.delete(workflowId);
  }

  getWorkflowStatus(workflowId: string): WorkflowStatus {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new WorkflowExecutionError(`Workflow not found: ${workflowId}`);
    }
    return workflow.status;
  }

  private updateWorkflowStatus(workflow: Workflow, status: WorkflowStatus): void {
    workflow.status = status;
    if (workflow.onStatusChange) {
      workflow.onStatusChange(status);
    }
    this.logger.log('INFO', `Workflow status updated: ${status}`, {
      workflowId: workflow.id,
      workflowName: workflow.name
    });
  }
}
