/**
 * Retry mechanisms for failed operations
 */

import React from 'react';
import { AppError, ErrorType, isRetryableError, createAppError, ErrorSeverity } from './errorUtils';
import errorLogger from './errorLogger';

export interface RetryOptions {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryCondition?: (error: AppError) => boolean;
    onRetry?: (attempt: number, error: AppError) => void;
}

export interface RetryResult<T> {
    success: boolean;
    data?: T;
    error?: AppError;
    attempts: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryCondition: isRetryableError,
};

/**
 * Retry an async operation with exponential backoff
 */
export async function retryAsync<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {},
    context?: { component?: string; action?: string }
): Promise<RetryResult<T>> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: AppError | undefined;
    let delay = config.initialDelay;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            const data = await operation();
            return {
                success: true,
                data,
                attempts: attempt,
            };
        } catch (error) {
            const appError = createAppError(
                error,
                ErrorType.UNKNOWN,
                ErrorSeverity.MEDIUM,
                { ...context, attempt }
            );

            lastError = appError;

            // Log the retry attempt
            errorLogger.logErrorWithRetry(
                error,
                { ...context, attempt },
                attempt - 1
            );

            // Check if we should retry
            const shouldRetry = attempt < config.maxAttempts && 
                              (config.retryCondition ? config.retryCondition(appError) : true);

            if (!shouldRetry) {
                break;
            }

            // Call retry callback
            if (config.onRetry) {
                config.onRetry(attempt, appError);
            }

            // Wait before next attempt (except for the last attempt)
            if (attempt < config.maxAttempts) {
                await sleep(delay);
                delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
            }
        }
    }

    return {
        success: false,
        error: lastError,
        attempts: config.maxAttempts,
    };
}

/**
 * Retry a synchronous operation
 */
export function retrySynchronous<T>(
    operation: () => T,
    options: Partial<RetryOptions> = {},
    context?: { component?: string; action?: string }
): RetryResult<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: AppError | undefined;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            const data = operation();
            return {
                success: true,
                data,
                attempts: attempt,
            };
        } catch (error) {
            const appError = createAppError(
                error,
                ErrorType.UNKNOWN,
                ErrorSeverity.MEDIUM,
                { ...context, attempt }
            );

            lastError = appError;

            // Log the retry attempt
            errorLogger.logErrorWithRetry(
                error,
                { ...context, attempt },
                attempt - 1
            );

            // Check if we should retry
            const shouldRetry = attempt < config.maxAttempts && 
                              (config.retryCondition ? config.retryCondition(appError) : true);

            if (!shouldRetry) {
                break;
            }

            // Call retry callback
            if (config.onRetry) {
                config.onRetry(attempt, appError);
            }
        }
    }

    return {
        success: false,
        error: lastError,
        attempts: config.maxAttempts,
    };
}

/**
 * React hook for retry functionality
 */
export function useRetry() {
    const [isRetrying, setIsRetrying] = React.useState(false);
    const [retryCount, setRetryCount] = React.useState(0);

    const retry = React.useCallback(async <T>(
        operation: () => Promise<T>,
        options?: Partial<RetryOptions>,
        context?: { component?: string; action?: string }
    ): Promise<RetryResult<T>> => {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);

        try {
            const result = await retryAsync(operation, options, context);
            return result;
        } finally {
            setIsRetrying(false);
        }
    }, []);

    const reset = React.useCallback(() => {
        setIsRetrying(false);
        setRetryCount(0);
    }, []);

    return {
        retry,
        isRetrying,
        retryCount,
        reset,
    };
}

/**
 * Higher-order function to add retry capability to any async function
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: Partial<RetryOptions> = {}
): (...args: Parameters<T>) => Promise<RetryResult<Awaited<ReturnType<T>>>> {
    return async (...args: Parameters<T>) => {
        return retryAsync(() => fn(...args), options);
    };
}

/**
 * Utility to create retry-enabled API calls
 */
export function createRetryableApiCall<T>(
    apiCall: () => Promise<T>,
    options: Partial<RetryOptions> = {}
) {
    const retryOptions: RetryOptions = {
        ...DEFAULT_RETRY_OPTIONS,
        retryCondition: (error) => {
            // Retry on network errors and 5xx server errors, but not 4xx client errors
            return error.type === ErrorType.NETWORK || 
                   (error.type === ErrorType.SERVER && error.code !== 500);
        },
        ...options,
    };

    return () => retryAsync(apiCall, retryOptions, { action: 'api_call' });
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


