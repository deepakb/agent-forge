import { LogTransport, LogLevel } from '@core/logging/logger';

export class ConsoleTransport implements LogTransport {
  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(formattedMessage, context ? JSON.stringify(context) : '');
  }
}
