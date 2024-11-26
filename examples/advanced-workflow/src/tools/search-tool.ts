import { Tool, ToolContext, ToolResult } from '@agent-forge/tools';
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

export interface SearchToolContext extends ToolContext {
  query: string;
  maxResults?: number;
  searchDepth?: 'basic' | 'advanced';
  includeDomains?: string[];
  excludeDomains?: string[];
}

export class SearchTool implements Tool {
  private apiKey: string;
  readonly name = 'search';
  readonly description = 'Performs web searches using Tavily API';
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TAVILY_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Tavily API key is required. Set TAVILY_API_KEY environment variable or pass it to the constructor.');
    }
  }

  async execute(context: SearchToolContext): Promise<ToolResult<SearchResult[]>> {
    try {
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: this.apiKey,
        query: context.query,
        search_depth: context.searchDepth || 'basic',
        max_results: context.maxResults || 5,
        include_domains: context.includeDomains || [],
        exclude_domains: context.excludeDomains || []
      });

      const results = response.data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.content,
        score: result.score
      }));

      return {
        success: true,
        data: results
      };
    } catch (error: any) {
      let errorMessage = 'Search failed';
      
      if (error.response) {
        // Handle specific API error codes
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid API key';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded';
            break;
          default:
            errorMessage = `API error: ${error.response.status}`;
        }
      }
      
      return {
        success: false,
        error: new Error(`${errorMessage}: ${error.message}`)
      };
    }
  }
}
