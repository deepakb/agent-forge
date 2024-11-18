import { randomUUID } from 'crypto';
import { MessageId } from './types';

export function generateMessageId(): MessageId {
  return randomUUID();
}