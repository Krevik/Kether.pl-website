/**
 * Enhanced error handling utilities with better classification and context
 */

export enum ErrorType {
    NETWORK = 'NETWORK',
    VALIDATION = 'VALIDATION',
    AUTHENTICATION = 'AUTHENTICATION',
    AUTHORIZATION = 'AUTHORIZATION',
    NOT_FOUND = 'NOT_FOUND',
    SERVER = 'SERVER',
    CLIENT = 'CLIENT',
    UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface AppError {
    type: ErrorType;
    severity: ErrorSeverity;
    message: string;
    code?: string | number;
    details?: Record<string, unknown>;
    timestamp: Date;
    stack?: string;
    context?: {
        component?: string;
        action?: string;
        userId?: string;
        url?: string;
        componentStack?: string;
        attempt?: number;
        attempts?: number;
        retryCount?: number;
        [key: string]: unknown;
    };
}

export type ErrorWithMessage = {
    message: string;
};

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;

    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError));
    }
}

export function getErrorMessage(error: unknown): string {
    return toErrorWithMessage(error).message;
}

/**
 * Safely extracts error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (isErrorWithMessage(error)) {
        return error.message;
    }
    return 'An unknown error occurred';
}

/**
 * Creates a structured AppError from various error types
 */
export function createAppError(
    error: unknown,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: AppError['context']
): AppError {
    const message = extractErrorMessage(error);
    const stack = error instanceof Error ? error.stack : undefined;
    
    // Try to determine error type from HTTP status codes or error messages
    let detectedType = type;
    let detectedSeverity = severity;
    let code: string | number | undefined;

    if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        code = status;
        
        if (status >= 400 && status < 500) {
            detectedType = status === 401 ? ErrorType.AUTHENTICATION : 
                         status === 403 ? ErrorType.AUTHORIZATION :
                         status === 404 ? ErrorType.NOT_FOUND : ErrorType.CLIENT;
            detectedSeverity = status === 401 || status === 403 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
        } else if (status >= 500) {
            detectedType = ErrorType.SERVER;
            detectedSeverity = ErrorSeverity.HIGH;
        }
    } else if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
        detectedType = ErrorType.NETWORK;
        detectedSeverity = ErrorSeverity.HIGH;
    } else if (message.toLowerCase().includes('validation') || message.toLowerCase().includes('invalid')) {
        detectedType = ErrorType.VALIDATION;
        detectedSeverity = ErrorSeverity.LOW;
    }

    return {
        type: detectedType,
        severity: detectedSeverity,
        message,
        code,
        details: error && typeof error === 'object' ? { ...error } : undefined,
        timestamp: new Date(),
        stack,
        context: {
            ...context,
            url: window.location.href,
        }
    };
}

/**
 * Determines if an error should be retried
 */
export function isRetryableError(error: AppError): boolean {
    return error.type === ErrorType.NETWORK || 
           (error.type === ErrorType.SERVER && error.code !== 500);
}

/**
 * Gets user-friendly error message based on error type
 */
export function getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
        case ErrorType.NETWORK:
            return 'Connection problem. Please check your internet connection and try again.';
        case ErrorType.AUTHENTICATION:
            return 'Please log in to continue.';
        case ErrorType.AUTHORIZATION:
            return 'You don\'t have permission to perform this action.';
        case ErrorType.NOT_FOUND:
            return 'The requested resource was not found.';
        case ErrorType.VALIDATION:
            return error.message; // Validation messages are usually user-friendly
        case ErrorType.SERVER:
            return 'Server error occurred. Please try again later.';
        case ErrorType.CLIENT:
            return 'There was a problem with your request. Please try again.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}
