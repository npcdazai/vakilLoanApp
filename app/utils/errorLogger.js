class ErrorLogger {
  constructor(config = {}) {
    this.config = {
      enableConsole: config.enableConsole ?? true,
      enableLocalStorage: config.enableLocalStorage ?? true,
      enableAPI: config.enableAPI ?? false,
      apiEndpoint: config.apiEndpoint || null,
      maxLocalStorageEntries: config.maxLocalStorageEntries || 50,
      logLevel: config.logLevel || 'error',
      ...config
    };
  }

  async log(error, context = {}) {
    const errorData = this.formatError(error, context);

    if (this.config.enableConsole) {
      this.logToConsole(errorData);
    }

    if (this.config.enableLocalStorage) {
      this.logToLocalStorage(errorData);
    }

    if (this.config.enableAPI && this.config.apiEndpoint) {
      await this.logToAPI(errorData);
    }

    return errorData;
  }

  formatError(error, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      level: this.config.logLevel,
      message: error?.message || 'Unknown error',
      stack: error?.stack || null,
      name: error?.name || 'Error',
      context: {
        userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'Server',
        url: typeof window !== 'undefined' ? window.location?.href : 'Server',
        userId: context.userId || 'anonymous',
        sessionId: context.sessionId || this.getSessionId(),
        component: context.component || 'Unknown',
        action: context.action || 'Unknown',
        ...context
      }
    };

    return errorData;
  }

  logToConsole(errorData) {
    const emoji = this.getLogEmoji(errorData.level);
    const color = this.getLogColor(errorData.level);

    console.group(`${emoji} ${errorData.level.toUpperCase()} - ${errorData.timestamp}`);
    console.log(`%c${errorData.message}`, `color: ${color}; font-weight: bold;`);
    
    if (errorData.stack) {
      console.log('Stack Trace:', errorData.stack);
    }
    
    if (errorData.context.component !== 'Unknown') {
      console.log('Component:', errorData.context.component);
    }
    
    if (errorData.context.action !== 'Unknown') {
      console.log('Action:', errorData.context.action);
    }
    
    console.log('Context:', errorData.context);
    console.groupEnd();
  }

  logToLocalStorage(errorData) {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = 'appErrorLogs';
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      existingLogs.push(errorData);
      
      if (existingLogs.length > this.config.maxLocalStorageEntries) {
        existingLogs.splice(0, existingLogs.length - this.config.maxLocalStorageEntries);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingLogs));
      
      if (this.config.enableConsole) {
        console.info('💾 Error saved to localStorage');
      }
    } catch (storageError) {
      console.error('Failed to save error to localStorage:', storageError);
    }
  }

  async logToAPI(errorData) {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Error-Logger': '1.0'
        },
        body: JSON.stringify(errorData)
      });

      if (!response.ok) {
        throw new Error(`API logging failed: ${response.status}`);
      }

      if (this.config.enableConsole) {
        console.info('📡 Error sent to API successfully');
      }
    } catch (apiError) {
      console.error('Failed to send error to API:', apiError);
      
      this.logToLocalStorage({
        ...errorData,
        apiError: apiError.message,
        fallbackReason: 'API_FAILED'
      });
    }
  }

  getLogEmoji(level) {
    const emojis = {
      error: '🚨',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🐛'
    };
    return emojis[level] || '📝';
  }

  getLogColor(level) {
    const colors = {
      error: '#dc2626',
      warn: '#d97706',
      info: '#2563eb',
      debug: '#7c3aed'
    };
    return colors[level] || '#374151';
  }

  getSessionId() {
    if (typeof window === 'undefined') return 'server-session';
    
    let sessionId = sessionStorage.getItem('errorLoggerSessionId');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('errorLoggerSessionId', sessionId);
    }
    return sessionId;
  }

  getStoredLogs() {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('appErrorLogs') || '[]');
    } catch {
      return [];
    }
  }

  clearStoredLogs() {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('appErrorLogs');
    console.info('🧹 Error logs cleared from localStorage');
  }

  exportLogs() {
    const logs = this.getStoredLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

export const errorLogger = new ErrorLogger();

export const createErrorLogger = (config) => new ErrorLogger(config);

export const logError = (error, context) => errorLogger.log(error, context);

export default ErrorLogger;