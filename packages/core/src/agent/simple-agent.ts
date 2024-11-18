import { BaseAgent } from './base-agent';
import { Context } from '../context/types';
import { AgentConfig } from './types';

export class SimpleAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.log('WARN', `Agent ${this.name} is already running`);
      return;
    }

    this.logger.log('INFO', `Starting agent ${this.name}`);
    this.isRunning = true;
    
    try {
      await this.execute({} as Context);
    } catch (error) {
      this.logger.log('ERROR', `Error starting agent ${this.name}`, { error });
      this.isRunning = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.log('WARN', `Agent ${this.name} is not running`);
      return;
    }

    this.logger.log('INFO', `Stopping agent ${this.name}`);
    this.isRunning = false;
  }
}
