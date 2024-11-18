import { BaseError } from '@core/error';

export type MessageType = string;
export type MessageId = string;

export interface Message<T = unknown> {
  id: MessageId;
  type: MessageType;
  payload: T;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MessageHandler<T = unknown> {
  (message: Message<T>): Promise<void> | void;
}

export class MessageError extends BaseError {
  constructor(message: string, code: string = 'MESSAGE_ERROR', details?: string) {
    super(message, code, details);
  }
}

export interface MessageBusOptions {
  enableLogging?: boolean;
  retryAttempts?: number;
  asyncTimeout?: number;
}