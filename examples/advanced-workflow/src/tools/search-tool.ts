import { Tool, ToolContext, ToolResult } from '@tools/types';
import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface SearchToolContext extends ToolContext {
  query: string;
}

export class SearchTool implements Tool {
  private apiKey: string;
  readonly name = 'search';
  readonly description = 'Performs web searches using an external API';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(context: SearchToolContext): Promise<ToolResult<SearchResult[]>> {
    try {
      const response = await axios.get('https://api.search.service/search', {
        params: {
          q: context.query,
          key: this.apiKey
        }
      });

      const results = response.data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet
      }));

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: new Error(`Search failed: ${error}`)
      };
    }
  }
}
