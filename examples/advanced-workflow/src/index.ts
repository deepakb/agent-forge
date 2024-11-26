import { LogManager } from '@agent-forge/core';
import { BaseWorkflowEngine } from '@agent-forge/core';
import { OpenAIProvider } from '@agent-forge/llm-providers';
import { SearchTool } from './tools/search-tool';
import { ResearchAgent } from './agents/research-agent';
import { ResearchWorkflow } from './workflows/research-workflow';

// Add environment variables loading at the top
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // Initialize components
  const logger = LogManager.createLogger('console');
  const workflowEngine = new BaseWorkflowEngine(logger);
  
  const llmProvider = new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000
  }, logger);
  
  // Initialize the provider before using it
  await llmProvider.initialize();
  
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
