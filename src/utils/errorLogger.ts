/**
 * Error logging and tracking service
 */

import { AppError, ErrorSeverity, createAppError, ErrorType } from './errorUtils';

export interface ErrorLoggerConfig {
    enableConsoleLogging: boolean;
    enableRemoteLogging: boolean;
    remoteEndpoint?: string;
    maxRetries: number;
    logLevel: ErrorSeverity;
}

class ErrorLogger {
    private config: ErrorLoggerConfig;
    private errorQueue: AppError[] = [];
    private isOnline = navigator.onLine;

    constructor(config: Partial<ErrorLoggerConfig> = {}) {
        this.config = {
            enableConsoleLogging: process.env.NODE_ENV === 'development',
            enableRemoteLogging: process.env.NODE_ENV === 'production',
            maxRetries: 3,
            logLevel: ErrorSeverity.LOW,
            ...config,
        };

        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.flushErrorQueue();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        // Setup global error handlers
        this.setupGlobalErrorHandlers();
    }

    /**
     * Log an error with context
     */
    logError(
        error: unknown, 
        context?: AppError['context'],
        type?: ErrorType,
        severity?: ErrorSeverity
    ): void {
        const appError = createAppError(error, type, severity, context);
        
        // Check if error meets logging threshold
        if (!this.shouldLog(appError)) {
            return;
        }

        // Console logging
        if (this.config.enableConsoleLogging) {
            this.logToConsole(appError);
        }

        // Remote logging
        if (this.config.enableRemoteLogging) {
            if (this.isOnline) {
                this.sendToRemote(appError);
            } else {
                // Queue for later when online
                this.errorQueue.push(appError);
            }
        }

        // Store in localStorage for debugging (limited storage)
        this.storeLocally(appError);
    }

    /**
     * Log error with retry mechanism for failed operations
     */
    logErrorWithRetry(
        error: unknown,
        context?: AppError['context'],
        retryCount: number = 0
    ): void {
        const appError = createAppError(error, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM, {
            ...context,
            retryCount,
        });

        this.logError(appError, context);
    }

    /**
     * Get recent errors from localStorage
     */
    getRecentErrors(limit: number = 50): AppError[] {
        try {
            const errors = localStorage.getItem('app_errors');
            if (errors) {
                const parsedErrors = JSON.parse(errors);
                return parsedErrors.slice(-limit);
            }
        } catch (error) {
            console.warn('Failed to retrieve recent errors:', error);
        }
        return [];
    }

    /**
     * Clear stored errors
     */
    clearStoredErrors(): void {
        localStorage.removeItem('app_errors');
    }

    private setupGlobalErrorHandlers(): void {
        // Catch unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError(event.error, {
                component: 'Global',
                action: 'unhandled_error',
                url: event.filename,
            }, ErrorType.CLIENT, ErrorSeverity.HIGH);
        });

        // Catch unhandled Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError(event.reason, {
                component: 'Global',
                action: 'unhandled_promise_rejection',
            }, ErrorType.CLIENT, ErrorSeverity.HIGH);
        });
    }

    private shouldLog(error: AppError): boolean {
        const severityLevels = {
            [ErrorSeverity.LOW]: 0,
            [ErrorSeverity.MEDIUM]: 1,
            [ErrorSeverity.HIGH]: 2,
            [ErrorSeverity.CRITICAL]: 3,
        };

        return severityLevels[error.severity] >= severityLevels[this.config.logLevel];
    }

    private logToConsole(error: AppError): void {
        const style = this.getConsoleStyle(error.severity);
        
        console.group(`%c${error.type} Error - ${error.severity}`, style);
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        console.error('Context:', error.context);
        console.error('Details:', error.details);
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
        console.groupEnd();
    }

    private getConsoleStyle(severity: ErrorSeverity): string {
        switch (severity) {
            case ErrorSeverity.LOW:
                return 'color: #ffa500; font-weight: bold;';
            case ErrorSeverity.MEDIUM:
                return 'color: #ff6b35; font-weight: bold;';
            case ErrorSeverity.HIGH:
                return 'color: #e74c3c; font-weight: bold;';
            case ErrorSeverity.CRITICAL:
                return 'color: #fff; background: #e74c3c; font-weight: bold; padding: 2px 4px;';
            default:
                return 'color: #333; font-weight: bold;';
        }
    }

    private async sendToRemote(error: AppError): Promise<void> {
        if (!this.config.remoteEndpoint) {
            return;
        }

        try {
            await fetch(this.config.remoteEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                }),
            });
        } catch (remoteError) {
            // Fallback to console if remote logging fails
            console.warn('Failed to send error to remote endpoint:', remoteError);
            this.errorQueue.push(error); // Queue for retry
        }
    }

    private storeLocally(error: AppError): void {
        try {
            const existingErrors = this.getRecentErrors(49); // Keep only 49 to add 1 new
            const updatedErrors = [...existingErrors, error];
            
            localStorage.setItem('app_errors', JSON.stringify(updatedErrors));
        } catch (storageError) {
            // If localStorage is full or unavailable, clear old errors and try again
            try {
                this.clearStoredErrors();
                localStorage.setItem('app_errors', JSON.stringify([error]));
            } catch {
                // If still failing, just log to console
                console.warn('Unable to store error locally:', storageError);
            }
        }
    }

    private async flushErrorQueue(): Promise<void> {
        if (this.errorQueue.length === 0) {
            return;
        }

        const errorsToSend = [...this.errorQueue];
        this.errorQueue = [];

        for (const error of errorsToSend) {
            try {
                await this.sendToRemote(error);
            } catch {
                // If sending fails, put it back in queue for next retry
                this.errorQueue.push(error);
            }
        }
    }
}

// Create singleton instance
export const errorLogger = new ErrorLogger({
    remoteEndpoint: process.env.REACT_APP_ERROR_ENDPOINT,
});

// Export for use in components
export default errorLogger;
