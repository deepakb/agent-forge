# Advanced Workflow Example

This example demonstrates how to build an advanced research workflow using Agent Forge. The workflow uses an AI-powered research agent that can:

1. Generate a research outline
2. Identify different perspectives to explore
3. Conduct web searches using the Tavily API
4. Synthesize findings into a coherent article

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to `.env`:
   - Get an OpenAI API key from [OpenAI](https://platform.openai.com)
   - Get a Tavily API key from [Tavily](https://tavily.com)

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Build the example:
   ```bash
   pnpm build
   ```

5. Run the example:
   ```bash
   pnpm start
   ```

## How it Works

The example consists of several components:

1. **Research Agent**: An AI agent that can generate outlines, identify perspectives, and synthesize content
2. **Search Tool**: A tool that uses the Tavily API to perform web searches
3. **Research Workflow**: A workflow that coordinates the research process

The workflow follows these steps:
1. Generate an outline for the research topic
2. Identify different perspectives to explore
3. Conduct web searches from each perspective
4. Synthesize the findings into a final article

## Customization

You can customize the research topic by modifying the `topic` variable in `src/index.ts`. You can also adjust the search parameters in `src/tools/search-tool.ts` to control the depth and scope of web searches.
