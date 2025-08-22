import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullScreen?: boolean;
    minDelay?: number; // Minimum time to show spinner (prevents flashing)
    timeout?: number; // Timeout to show error state
    type?: 'spinner' | 'skeleton' | 'progressive';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'medium', 
    message,
    fullScreen = false,
    minDelay = 300, // Show spinner for at least 300ms to prevent flashing
    timeout = 10000, // 10 second timeout
    type = 'spinner'
}) => {
    const { t } = useTranslation();
    const defaultMessage = t('common.loading');
    const displayMessage = message || defaultMessage;
    const [shouldShow, setShouldShow] = useState(false);
    const [hasTimedOut, setHasTimedOut] = useState(false);

    useEffect(() => {
        // Delay showing spinner to prevent flashing for fast loads
        const showTimer = setTimeout(() => {
            setShouldShow(true);
        }, minDelay);

        // Timeout for error state
        const timeoutTimer = setTimeout(() => {
            setHasTimedOut(true);
        }, timeout);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(timeoutTimer);
        };
    }, [minDelay, timeout]);

    // Don't render anything if we haven't reached the minimum delay
    if (!shouldShow) {
        return null;
    }

    if (hasTimedOut) {
        return (
            <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
                <div className="loading-error">
                    <div className="error-icon">⚠️</div>
                    <p className="error-message">{t('errors.loadingTimeout')}</p>
                    <button 
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        {t('common.retry')}
                    </button>
                </div>
            </div>
        );
    }

    if (type === 'skeleton') {
        return (
            <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
                <div className="skeleton-content">
                    <div className="skeleton-header skeleton"></div>
                    <div className="skeleton-line skeleton"></div>
                    <div className="skeleton-line skeleton"></div>
                    <div className="skeleton-line skeleton" style={{ width: '60%' }}></div>
                </div>
            </div>
        );
    }

    if (type === 'progressive') {
        return (
            <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
                <div className="progressive-loading">
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <p className="loading-message">{displayMessage}</p>
                </div>
            </div>
        );
    }

    // Default spinner
    const spinnerClass = `loading-spinner ${size}`;
    const containerClass = fullScreen ? 'loading-container fullscreen' : 'loading-container';

    return (
        <div className={containerClass}>
            <div className={spinnerClass}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {displayMessage && <p className="loading-message">{displayMessage}</p>}
        </div>
    );
};

export default LoadingSpinner;
