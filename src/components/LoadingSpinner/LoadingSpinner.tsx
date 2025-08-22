import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'medium', 
    message = 'Loading...',
    fullScreen = false 
}) => {
    const spinnerClass = `loading-spinner ${size}`;
    const containerClass = fullScreen ? 'loading-container fullscreen' : 'loading-container';

    return (
        <div className={containerClass}>
            <div className={spinnerClass}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
