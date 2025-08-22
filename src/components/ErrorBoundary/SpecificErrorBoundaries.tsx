/**
 * Specific error boundaries for different sections of the application
 */

import React from 'react';
import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';
import { 
    ServerInfoErrorFallback, 
    BindsErrorFallback, 
    MinimalErrorFallback 
} from './FallbackComponents';

/**
 * Error boundary specifically for server info section
 */
export const ServerInfoErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
    children 
}) => (
    <ErrorBoundary
        fallback={ServerInfoErrorFallback}
        context={{
            component: 'ServerInfo',
            section: 'server_status'
        }}
    >
        {children}
    </ErrorBoundary>
);

/**
 * Error boundary for binds/hall of fame sections
 */
export const BindsErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
    children 
}) => (
    <ErrorBoundary
        fallback={BindsErrorFallback}
        context={{
            component: 'Binds',
            section: 'hall_of_fame'
        }}
    >
        {children}
    </ErrorBoundary>
);

/**
 * Error boundary for navigation components
 */
export const NavigationErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
    children 
}) => (
    <ErrorBoundary
        fallback={MinimalErrorFallback}
        context={{
            component: 'Navigation',
            section: 'navbar'
        }}
    >
        {children}
    </ErrorBoundary>
);

/**
 * Error boundary for form components
 */
export const FormErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ 
    children 
}) => (
    <ErrorBoundary
        fallback={MinimalErrorFallback}
        context={{
            component: 'Form',
            section: 'user_input'
        }}
    >
        {children}
    </ErrorBoundary>
);

/**
 * HOC for server info components
 */
export const withServerInfoErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
    fallback: ServerInfoErrorFallback,
    context: {
        component: 'ServerInfo',
        section: 'server_status'
    }
});

/**
 * HOC for binds components
 */
export const withBindsErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
    fallback: BindsErrorFallback,
    context: {
        component: 'Binds',
        section: 'hall_of_fame'
    }
});

/**
 * HOC for navigation components
 */
export const withNavigationErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
    fallback: MinimalErrorFallback,
    context: {
        component: 'Navigation',
        section: 'navbar'
    }
});

/**
 * HOC for form components
 */
export const withFormErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
    fallback: MinimalErrorFallback,
    context: {
        component: 'Form',
        section: 'user_input'
    }
});
