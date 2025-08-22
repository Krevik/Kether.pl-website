/**
 * Utility functions for consistent error handling across the application
 */

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
