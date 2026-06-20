// Logger Utility

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LOG_LEVEL_NAMES = ['DEBUG', 'INFO', 'WARN', 'ERROR']

export interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: Record<string, any>
}

class Logger {
  private level: LogLevel
  private logs: LogEntry[] = []
  private maxLogs: number = 1000

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (level < this.level) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LOG_LEVEL_NAMES[level],
      message,
      context,
    }

    this.logs.push(entry)

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    const color = this.getColor(level)
    const prefix = `${color}[${entry.level}]${this.colors.reset}`
    
    if (context) {
      console.log(`${prefix} ${message}`, context)
    } else {
      console.log(`${prefix} ${message}`)
    }
  }

  private getColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
    }
    return colors[level] || ''
  }

  private colors = {
    reset: '\x1b[0m',
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }
}

export const logger = new Logger(
  process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
)

// Request logging middleware helper
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
): void {
  const context = {
    method,
    path,
    statusCode,
    duration: `${duration}ms`,
    userId,
  }

  if (statusCode >= 500) {
    logger.error('Request failed', context)
  } else if (statusCode >= 400) {
    logger.warn('Request error', context)
  } else {
    logger.info('Request completed', context)
  }
}
