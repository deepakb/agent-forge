import { generateMessageId } from '../communication/utils';
import {
  Workflow,
  WorkflowBuilder,
  WorkflowContext,
  WorkflowStep
} from './types';

export class BaseWorkflowBuilder implements WorkflowBuilder {
  private workflow: Partial<Workflow>;
  private steps: WorkflowStep[] = [];

  constructor() {
    this.workflow = {
      id: generateMessageId(),
      status: 'PENDING',
      context: {},
      steps: []
    };
  }

  setName(name: string): WorkflowBuilder {
    this.workflow.name = name;
    return this;
  }

  setDescription(description: string): WorkflowBuilder {
    this.workflow.description = description;
    return this;
  }

  addStep(step: WorkflowStep): WorkflowBuilder {
    this.steps.push(step);
    return this;
  }

  setContext(context: WorkflowContext): WorkflowBuilder {
    this.workflow.context = context;
    return this;
  }

  build(): Workflow {
    if (!this.workflow.name) {
      throw new Error('Workflow name is required');
    }

    return {
      ...this.workflow,
      steps: this.steps,
    } as Workflow;
  }
}
