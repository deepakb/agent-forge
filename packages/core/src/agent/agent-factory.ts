import { AgentType, AgentFactory, AgentConfig, Agent } from './types';
import { SimpleAgent } from './simple-agent';
import { BaseError } from '../error/base-error';
import { LogManager } from '../logging/log-manager';

export class DefaultAgentFactory implements AgentFactory {
  private logger = LogManager.createLogger('console');

  createAgent(type: AgentType, config: AgentConfig): Agent {
    this.logger.log('INFO', `Creating agent of type: ${type}`);

    try {
      switch (type) {
        case AgentType.Simple:
          return new SimpleAgent(config);
        
        default:
          throw new BaseError(
            `Unsupported agent type: ${type}`,
            'INVALID_AGENT_TYPE',
            `Agent type ${type} is not implemented`
          );
      }
    } catch (error) {
      this.logger.log('ERROR', `Failed to create agent`, { type, error });
      throw error;
    }
  }
}
