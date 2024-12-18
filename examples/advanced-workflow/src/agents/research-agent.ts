import { BaseAgent } from '@agent-forge/core';
import { Context } from '@agent-forge/core';
import { Logger } from '@agent-forge/core';
import { LLMProvider } from '@agent-forge/llm-providers';
import { SearchTool, SearchResult } from '../tools/search-tool';

export interface ResearchContext extends Context {
  topic: string;
  outline?: string;
  perspectives?: string[];
  searchResults?: SearchResult[];
  finalContent?: string;
}

export class ResearchAgent extends BaseAgent {
  private llmProvider: LLMProvider;
  private searchTool: SearchTool;
  protected logger: Logger;

  constructor(
    llmProvider: LLMProvider, 
    searchTool: SearchTool,
    logger: Logger
  ) {
    super({
      id: 'research-agent',
      name: 'ResearchAgent',
      description: 'Conducts research on topics using LLM and search tools'
    });
    this.llmProvider = llmProvider;
    this.searchTool = searchTool;
    this.logger = logger;
  }

  async generateOutline(topic: string): Promise<string> {
    const response = await this.llmProvider.generate({
      prompt: `Create a detailed outline for the topic: ${topic}`
    });
    return response.text;
  }

  async generatePerspectives(topic: string): Promise<string[]> {
    const response = await this.llmProvider.generate({
      prompt: `Generate different expert perspectives for researching: ${topic}`
    });
    return response.text.split('\n').filter(p => p.trim());
  }

  async conductResearch(topic: string, perspective: string): Promise<SearchResult[]> {
    const result = await this.searchTool.execute({
      query: `${topic} ${perspective}`
    });
    
    if (!result.success || !result.data) {
      throw result.error || new Error('Search failed');
    }
    
    return result.data;
  }

  async synthesizeContent(
    topic: string, 
    outline: string,
    searchResults: SearchResult[]
  ): Promise<string> {
    const response = await this.llmProvider.generate({
      prompt: `Synthesize this research into an article:\nTopic: ${topic}\nOutline: ${outline}\nResearch: ${JSON.stringify(searchResults)}`
    });
    return response.text;
  }

  async execute(context: ResearchContext): Promise<ResearchContext> {
    this.logger.log('INFO', 'Starting research workflow', { topic: context.topic });
    
    // Generate outline
    context.outline = await this.generateOutline(context.topic);
    
    // Generate perspectives
    context.perspectives = await this.generatePerspectives(context.topic);
    
    // Conduct research from each perspective
    const allResults: SearchResult[] = [];
    for (const perspective of context.perspectives) {
      const results = await this.conductResearch(context.topic, perspective);
      allResults.push(...results);
    }
    context.searchResults = allResults;
    
    // Synthesize final content
    context.finalContent = await this.synthesizeContent(
      context.topic,
      context.outline,
      context.searchResults
    );
    
    return context;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.log('WARN', `Agent ${this.name} is already running`);
      return;
    }

    this.logger.log('INFO', `Starting research agent ${this.name}`);
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.log('WARN', `Agent ${this.name} is not running`);
      return;
    }

    this.logger.log('INFO', `Stopping research agent ${this.name}`);
    this.isRunning = false;
  }
}