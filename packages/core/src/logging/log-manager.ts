import { Logger, LogLevel, LogTransport } from './logger';
import { ConsoleTransport } from './transports/console';
import { FileTransport } from './transports/file';
import { HttpTransport } from './transports/http';

export class LogManager {
  private logger: Logger;

  constructor(logger: Logger = new LoggerImplementation(new ConsoleTransport())) {
    this.logger = logger;
  }

  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    this.logger.log(level, message, context);
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }

  static createLogger(type: 'console' | 'file' | 'http', config?: any): Logger {
    switch (type) {
      case 'console':
        return new LoggerImplementation(new ConsoleTransport());
      case 'file':
        return new LoggerImplementation(new FileTransport(config?.filePath));
      case 'http':
        return new LoggerImplementation(new HttpTransport(config?.apiUrl));
      default:
        throw new Error('Invalid logger type');
    }
  }
}

class LoggerImplementation implements Logger {
  private transport: LogTransport;

  constructor(transport: LogTransport) {
    this.transport = transport;
  }

  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    this.transport.log(level, message, context);
  }

  setTransport(transport: LogTransport): void {
    this.transport = transport;
  }
}
