import { Agent } from '../agent';
import { ok } from 'neverthrow';
import { describe, it, expect } from 'vitest';
import { Executor } from '../executor'; // Import the Executor type
import { AgentConfig, ExecutorConfig } from '../types'; // Import the AgentConfig type
import { ValidationError } from '../errors'; // Import ValidationError

// Create a mock Executor class
class MockExecutor extends Executor {
  constructor(config: ExecutorConfig) {
    super(config); // Call the parent constructor
  }

  async execute() {
    return ok({
      messages: [],
      finish_reason: 'stop' as
        | 'length'
        | 'stop'
        | 'tool_calls'
        | 'content_filter'
        | 'function_call',
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    });
  }

  // Implement any other methods or properties as needed
}

describe('Agent', () => {
  it('should create an agent with valid config', () => {
    const config: AgentConfig = {
      name: 'Test Agent',
      model: 'gpt-3.5-turbo', // Replace with a valid model
      systemPrompt: 'You are a helpful assistant.',
      capabilities: [], // Add any capabilities if needed
      configuration: {
        temperature: 0.7,
        maxTokens: 150,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        parallelCapabilities: true,
      },
    };

    const executor = new MockExecutor({
      apiKey: 'your-api-key', // Provide a valid API key
      organizationId: 'your-organization-id', // Optional
      baseURL: 'https://api.openai.com/v1', // Optional
      timeoutMs: 30000, // Optional
      maxRetries: 3, // Optional
      debug: true, // Optional
    });

    const agent = new Agent(config, executor);
    expect(agent).toBeInstanceOf(Agent);
  });

  it('should return an error for invalid config', () => {
    const invalidConfig: AgentConfig = {
      name: '', // Invalid name
      model: 'gpt-3.5-turbo',
      systemPrompt: 'You are a helpful assistant.',
      capabilities: [],
      configuration: {
        temperature: 0.7,
        maxTokens: 150,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        parallelCapabilities: true,
      },
    };

    const executor = new MockExecutor({
      apiKey: 'your-api-key', // Provide a valid API key
      organizationId: 'your-organization-id', // Optional
      baseURL: 'https://api.openai.com/v1', // Optional
      timeoutMs: 30000, // Optional
      maxRetries: 3, // Optional
      debug: true, // Optional
    });

    // Adjust the expectation to check for the specific error message or code
    expect(() => new Agent(invalidConfig, executor)).toThrow(ValidationError);
  });
});
