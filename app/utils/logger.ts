import { config } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private readonly isEnabled: boolean;
  private readonly minLevel: LogLevel;

  private constructor() {
    this.isEnabled = config.logging.enabled;
    this.minLevel = config.logging.level;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isEnabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry = this.formatLog(level, message, data);
    const output = JSON.stringify(entry, null, 2);

    switch (level) {
      case 'debug':
        console.debug(output);
        break;
      case 'info':
        console.info(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  }

  public debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  public error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  public logRequest(request: Request, response: Response, duration: number): void {
    this.info('Request completed', {
      method: request.method,
      url: request.url,
      status: response.status,
      duration: `${duration}ms`,
    });
  }

  public logError(error: Error, context?: unknown): void {
    this.error('Error occurred', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }
}

export const logger = Logger.getInstance(); 