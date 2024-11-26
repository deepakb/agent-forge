import { BaseWorkflowBuilder } from '@agent-forge/core';
import { WorkflowStep, WorkflowContext, Workflow } from '@agent-forge/core';
import { ResearchAgent, ResearchContext } from '../agents/research-agent';

export class ResearchWorkflow {
  private agent: ResearchAgent;

  constructor(agent: ResearchAgent) {
    this.agent = agent;
  }

  private createOutlineStep(): WorkflowStep {
    return {
      name: 'Generate Outline',
      execute: async (context: ResearchContext) => {
        context.outline = await this.agent.generateOutline(context.topic);
        return context;
      }
    };
  }

  private createPerspectivesStep(): WorkflowStep {
    return {
      name: 'Generate Perspectives',
      execute: async (context: ResearchContext) => {
        context.perspectives = await this.agent.generatePerspectives(context.topic);
        return context;
      }
    };
  }

  private createResearchStep(): WorkflowStep {
    return {
      name: 'Conduct Research',
      execute: async (context: ResearchContext) => {
        const allResults = [];
        for (const perspective of context.perspectives || []) {
          const results = await this.agent.conductResearch(context.topic, perspective);
          allResults.push(...results);
        }
        context.searchResults = allResults;
        return context;
      }
    };
  }

  private createSynthesisStep(): WorkflowStep {
    return {
      name: 'Synthesize Content',
      execute: async (context: ResearchContext) => {
        if (!context.outline || !context.searchResults) {
          throw new Error('Missing outline or search results');
        }
        context.finalContent = await this.agent.synthesizeContent(
          context.topic,
          context.outline,
          context.searchResults
        );
        return context;
      }
    };
  }

  buildWorkflow(topic: string): Workflow {
    const builder = new BaseWorkflowBuilder<ResearchContext>();
    
    builder
      .setName('Research Workflow')
      .setDescription(`Research workflow for topic: ${topic}`)
      .setContext({ topic })
      .addStep(this.createOutlineStep())
      .addStep(this.createPerspectivesStep())
      .addStep(this.createResearchStep())
      .addStep(this.createSynthesisStep());
    
    return builder.build();
  }
}
