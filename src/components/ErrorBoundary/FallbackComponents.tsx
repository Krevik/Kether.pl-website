/**
 * Fallback components for different error scenarios
 */

import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AppError, ErrorType, ErrorSeverity } from '../../utils/errorUtils';

export interface ErrorFallbackProps {
    error: AppError;
    onRetry?: () => void;
    onReport?: () => void;
}

/**
 * Generic error fallback component
 */
export const GenericErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error, 
    onRetry, 
    onReport 
}) => {
    const getErrorIcon = () => {
        switch (error.type) {
            case ErrorType.NETWORK:
                return 'pi pi-wifi';
            case ErrorType.SERVER:
                return 'pi pi-server';
            case ErrorType.NOT_FOUND:
                return 'pi pi-search';
            case ErrorType.AUTHENTICATION:
                return 'pi pi-lock';
            case ErrorType.AUTHORIZATION:
                return 'pi pi-shield';
            default:
                return 'pi pi-exclamation-triangle';
        }
    };

    const getErrorColor = () => {
        switch (error.severity) {
            case ErrorSeverity.CRITICAL:
                return '#e74c3c';
            case ErrorSeverity.HIGH:
                return '#f39c12';
            case ErrorSeverity.MEDIUM:
                return '#f39c12';
            default:
                return '#95a5a6';
        }
    };

    return (
        <Card 
            className="error-fallback"
            style={{
                textAlign: 'center',
                padding: '2rem',
                margin: '1rem',
                border: `2px solid ${getErrorColor()}`,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white'
            }}
        >
            <div style={{ marginBottom: '1rem' }}>
                <i 
                    className={getErrorIcon()} 
                    style={{ 
                        fontSize: '3rem', 
                        color: getErrorColor(),
                        marginBottom: '1rem',
                        display: 'block'
                    }}
                />
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
                    Oops! Something went wrong
                </h3>
                <p style={{ color: '#bdc3c7', marginBottom: '1.5rem' }}>
                    {error.message}
                </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {onRetry && (
                    <Button
                        label="Try Again"
                        icon="pi pi-refresh"
                        onClick={onRetry}
                        className="p-button-outlined"
                    />
                )}
                
                <Button
                    label="Go Home"
                    icon="pi pi-home"
                    onClick={() => window.location.href = '/'}
                    className="p-button-outlined"
                />
                
                {onReport && (
                    <Button
                        label="Report Issue"
                        icon="pi pi-flag"
                        onClick={onReport}
                        className="p-button-outlined p-button-secondary"
                        style={{ fontSize: '0.875rem' }}
                    />
                )}
            </div>
        </Card>
    );
};

/**
 * Server info specific error fallback
 */
export const ServerInfoErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error, 
    onRetry 
}) => (
    <Card 
        className="server-info-error"
        style={{
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid #e74c3c',
            color: 'white'
        }}
    >
        <i 
            className="pi pi-server" 
            style={{ 
                fontSize: '2rem', 
                color: '#e74c3c',
                marginBottom: '1rem',
                display: 'block'
            }}
        />
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
            Server Information Unavailable
        </h4>
        <p style={{ color: '#bdc3c7', marginBottom: '1rem' }}>
            Unable to fetch server status. The server might be temporarily unavailable.
        </p>
        {onRetry && (
            <Button
                label="Refresh Server Info"
                icon="pi pi-refresh"
                onClick={onRetry}
                className="p-button-sm p-button-outlined"
            />
        )}
    </Card>
);

/**
 * Binds/Hall of Fame specific error fallback
 */
export const BindsErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error, 
    onRetry 
}) => (
    <Card 
        className="binds-error"
        style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid #f39c12',
            color: 'white'
        }}
    >
        <i 
            className="pi pi-list" 
            style={{ 
                fontSize: '2.5rem', 
                color: '#f39c12',
                marginBottom: '1rem',
                display: 'block'
            }}
        />
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>
            Unable to Load Binds
        </h4>
        <p style={{ color: '#bdc3c7', marginBottom: '1.5rem' }}>
            We couldn't load the binds data. This might be a temporary issue.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {onRetry && (
                <Button
                    label="Reload Binds"
                    icon="pi pi-refresh"
                    onClick={onRetry}
                    className="p-button-outlined"
                />
            )}
            <Button
                label="View Cached Binds"
                icon="pi pi-database"
                onClick={() => {
                    // Could implement offline/cached data viewing
                    console.log('Show cached binds');
                }}
                className="p-button-outlined p-button-secondary"
            />
        </div>
    </Card>
);

/**
 * Network error specific fallback
 */
export const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error, 
    onRetry 
}) => (
    <Card 
        className="network-error"
        style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #e74c3c',
            color: 'white'
        }}
    >
        <i 
            className="pi pi-wifi" 
            style={{ 
                fontSize: '3rem', 
                color: '#e74c3c',
                marginBottom: '1rem',
                display: 'block'
            }}
        />
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
            Connection Problem
        </h3>
        <p style={{ color: '#bdc3c7', marginBottom: '1rem' }}>
            Please check your internet connection and try again.
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
            <small style={{ color: '#95a5a6' }}>
                Status: {navigator.onLine ? 'Online' : 'Offline'}
            </small>
        </div>
        {onRetry && (
            <Button
                label="Try Again"
                icon="pi pi-refresh"
                onClick={onRetry}
                className="p-button-outlined"
            />
        )}
    </Card>
);

/**
 * Minimal error fallback for small components
 */
export const MinimalErrorFallback: React.FC<ErrorFallbackProps> = ({ 
    error, 
    onRetry 
}) => (
    <div 
        style={{
            padding: '1rem',
            textAlign: 'center',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid #e74c3c',
            borderRadius: '4px',
            color: 'white'
        }}
    >
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
            <i className="pi pi-exclamation-triangle" style={{ marginRight: '0.5rem' }} />
            Unable to load content
        </p>
        {onRetry && (
            <Button
                label="Retry"
                icon="pi pi-refresh"
                onClick={onRetry}
                className="p-button-sm p-button-text"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            />
        )}
    </div>
);
