import fs from 'fs';
import path from 'path';
import { LogTransport, LogLevel } from '@core/logging/logger';

export class FileTransport implements LogTransport {
  private logFilePath: string;

  constructor(logFilePath: string = path.join(__dirname, 'logs', 'app.log')) {
    this.logFilePath = logFilePath;
    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
    }
  }

  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;
    const logMessage = context ? `${formattedMessage} ${JSON.stringify(context)}` : formattedMessage;

    fs.appendFileSync(this.logFilePath, logMessage + '\n');
  }
}
