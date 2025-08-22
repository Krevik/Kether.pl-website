import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import KetherApplication from './components/KetherAppMain/KetherApplication';
import { Provider } from 'react-redux';
import { appStore, persistedAppStore } from './redux/store';
import './global.css';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import errorLogger from './utils/errorLogger';
import { analyzeBundleSize } from './utils/performanceUtils';
import './i18n'; // Initialize i18n

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
    analyzeBundleSize();
}

root.render(
    <React.StrictMode>
        <ErrorBoundary
            context={{
                component: 'App',
                section: 'root'
            }}
            onError={(error, errorInfo) => {
                // Log critical application errors
                errorLogger.logError(
                    error,
                    {
                        component: 'App',
                        section: 'root',
                        componentStack: errorInfo.componentStack || undefined,
                    },
                    error.type,
                    error.severity
                );
            }}
        >
            <Provider store={appStore}>
                <PersistGate loading={null} persistor={persistedAppStore}>
                    <KetherApplication />
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
