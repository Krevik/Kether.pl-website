import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorType, ErrorSeverity, createAppError } from '../../utils/errorUtils';
import errorLogger from '../../utils/errorLogger';
import { GenericErrorFallback, ErrorFallbackProps } from './FallbackComponents';

interface Props {
    children: ReactNode;
    fallback?: React.ComponentType<ErrorFallbackProps>;
    context?: {
        component?: string;
        section?: string;
    };
    onError?: (error: AppError, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    appError?: AppError;
    retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { 
            hasError: false, 
            retryCount: 0 
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        const appError = createAppError(
            error,
            ErrorType.CLIENT,
            ErrorSeverity.HIGH
        );

        return { 
            hasError: true, 
            appError 
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const appError = createAppError(
            error,
            ErrorType.CLIENT,
            ErrorSeverity.HIGH,
            {
                ...this.props.context,
                action: 'component_error',
                componentStack: errorInfo.componentStack || undefined,
            }
        );

        // Log the error
        errorLogger.logError(
            error,
            {
                ...this.props.context,
                componentStack: errorInfo.componentStack || undefined,
                retryCount: this.state.retryCount,
            },
            ErrorType.CLIENT,
            ErrorSeverity.HIGH
        );

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(appError, errorInfo);
        }

        this.setState({ appError });
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            appError: undefined,
            retryCount: prevState.retryCount + 1
        }));
    };

    handleReport = () => {
        if (this.state.appError) {
            // Could integrate with error reporting service
            const errorReport = {
                error: this.state.appError,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                retryCount: this.state.retryCount,
            };

            // For now, copy to clipboard for user to report
            navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
                .then(() => {
                    alert('Error details copied to clipboard. Please send this to support.');
                })
                .catch(() => {
                    console.error('Error details:', errorReport);
                    alert('Please check the console for error details and report to support.');
                });
        }
    };

    render() {
        if (this.state.hasError && this.state.appError) {
            const FallbackComponent = this.props.fallback || GenericErrorFallback;

            return (
                <FallbackComponent
                    error={this.state.appError}
                    onRetry={this.state.retryCount < 3 ? this.handleRetry : undefined}
                    onReport={this.handleReport}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Higher-order component for easier error boundary usage
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    errorBoundaryProps?: Omit<Props, 'children'>
) {
    const WithErrorBoundaryComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    WithErrorBoundaryComponent.displayName = 
        `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithErrorBoundaryComponent;
}
