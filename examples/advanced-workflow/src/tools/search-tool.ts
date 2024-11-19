import { Tool } from '@core/tools/base-tool';
import axios from 'axios';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export class SearchTool implements Tool {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get('https://api.search.service/search', {
        params: {
          q: query,
          key: this.apiKey
        }
      });

      return response.data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet
      }));
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  }
}
