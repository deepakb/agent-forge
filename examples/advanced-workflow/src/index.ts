import { LogManager } from '@core/logging';
import { BaseWorkflowEngine } from '@core/workflow/workflow-engine';
import { OpenAIProvider } from '@llm-providers/providers/openai';
import { SearchTool } from './tools/search-tool';
import { ResearchAgent } from './agents/research-agent';
import { ResearchWorkflow } from './workflows/research-workflow';

async function main() {
  // Initialize components
  const logger = LogManager.createLogger('console');
  const workflowEngine = new BaseWorkflowEngine(logger);
  
  const llmProvider = new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    maxTokens: 1000
  }, logger);
  
  const searchTool = new SearchTool(process.env.SEARCH_API_KEY || '');
  
  // Initialize agent and workflow
  const researchAgent = new ResearchAgent(llmProvider, searchTool, logger);
  const researchWorkflow = new ResearchWorkflow(researchAgent);
  
  // Execute workflow
  const topic = "Impact of AI on climate change";
  const workflow = researchWorkflow.buildWorkflow(topic);
  
  try {
    const result = await workflowEngine.executeWorkflow(workflow);
    console.log('Research completed:', result.context.finalContent);
  } catch (error) {
    console.error('Workflow failed:', error);
  }
}

main().catch(console.error);
