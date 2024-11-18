import { Logger, LogManager } from '@core/logging';
import { Message, MessageHandler, MessageType, MessageError, MessageBusOptions } from './types';
import { generateMessageId } from '@core/communication/utils';

export class MessageBus {
  private handlers: Map<MessageType, Set<MessageHandler>> = new Map();
  private logger: Logger;
  private options: Required<MessageBusOptions>;

  constructor(options: MessageBusOptions = {}) {
    this.options = {
      enableLogging: true,
      retryAttempts: 3,
      asyncTimeout: 5000,
      ...options
    };
    
    this.logger = LogManager.createLogger(
      this.options.enableLogging ? 'console' : 'file'
    );
  }

  public subscribe<T>(type: MessageType, handler: MessageHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    this.handlers.get(type)!.add(handler as MessageHandler);
    this.logger.log('INFO', `Subscribed to message type: ${type}`);

    return () => this.unsubscribe(type, handler);
  }

  public async publish<T>(type: MessageType, payload: T): Promise<void> {
    const message: Message<T> = {
      id: generateMessageId(),
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    const handlers = this.handlers.get(type);
    if (!handlers || handlers.size === 0) {
      this.logger.log('WARN', `No handlers registered for message type: ${type}`);
      return;
    }

    try {
      await this.dispatchToHandlers(handlers, message);
    } catch (error) {
      this.handlePublishError(error, message);
    }
  }

  private async dispatchToHandlers<T>(
    handlers: Set<MessageHandler>,
    message: Message<T>
  ): Promise<void> {
    const promises = Array.from(handlers).map(handler =>
      this.executeHandler(handler, message)
    );

    await Promise.all(promises);
  }

  private async executeHandler<T>(
    handler: MessageHandler,
    message: Message<T>
  ): Promise<void> {
    try {
      await handler(message);
    } catch (error) {
      throw new MessageError(
        `Handler execution failed for message type: ${message.type}`,
        'HANDLER_ERROR',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private handlePublishError(error: unknown, message: Message): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.log('ERROR', `Failed to publish message`, {
      error: errorMessage,
      messageType: message.type,
      messageId: message.id
    });
    throw new MessageError(
      'Message publication failed',
      'PUBLISH_ERROR',
      errorMessage
    );
  }

  private unsubscribe<T>(type: MessageType, handler: MessageHandler<T>): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler as MessageHandler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
      this.logger.log('INFO', `Unsubscribed from message type: ${type}`);
    }
  }
}