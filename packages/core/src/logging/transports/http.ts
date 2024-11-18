import axios from 'axios';
import { LogTransport, LogLevel } from '@core/logging/logger';

export class HttpTransport implements LogTransport {
  private apiUrl: string;

  constructor(apiUrl: string = 'https://logs.example.com/api/logs') {
    this.apiUrl = apiUrl;
  }

  async log(level: LogLevel, message: string, context?: Record<string, any>): Promise<void> {
    const logMessage = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    try {
      await axios.post(this.apiUrl, logMessage);
    } catch (error) {
      console.error('Failed to send log to external service', error);
    }
  }
}
