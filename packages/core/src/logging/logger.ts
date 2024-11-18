export type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'FATAL';

export interface Logger {
  log(level: LogLevel, message: string, context?: Record<string, any>): void;
  setTransport(transport: LogTransport): void;
}

export interface LogTransport {
  log(level: LogLevel, message: string, context?: Record<string, any>): void;
}
