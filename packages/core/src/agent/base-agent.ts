import { Logger } from '../logging/logger';
import { LogManager } from '../logging/log-manager';
import { Context } from '../context/types';
import { Agent, AgentAction, AgentConfig } from './types';
import { BaseError } from '../error/base-error';

export abstract class BaseAgent implements Agent {
  protected logger: Logger;
  protected actions: AgentAction[] = [];
  protected isRunning: boolean = false;
  
  public readonly id: string;
  public readonly name: string;
  
  constructor(config: AgentConfig) {
    this.id = config.id;
    this.name = config.name;
    this.logger = LogManager.createLogger('console');
  }

  public addAction(action: AgentAction): void {
    this.actions.push(action);
    this.logger.log('DEBUG', `Action added to agent ${this.name}`);
  }

  public async execute(context: Context): Promise<Context> {
    this.logger.log('INFO', `Executing agent ${this.name}`);
    let currentContext = { ...context };

    try {
      for (const action of this.actions) {
        currentContext = await action.execute(currentContext);
      }
      
      this.logger.log('INFO', `Agent ${this.name} execution completed`);
      return currentContext;
    } catch (error) {
      this.logger.log('ERROR', `Error executing agent ${this.name}`, { error });
      if (error instanceof Error) {
        throw new BaseError(
          `Agent execution failed: ${error.message}`,
          'AGENT_EXECUTION_ERROR',
          error.message
        );
      } else {
        throw new BaseError(
          `Agent execution failed: ${String(error)}`,
          'AGENT_EXECUTION_ERROR',
          String(error)
        );
      }
    }
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}
