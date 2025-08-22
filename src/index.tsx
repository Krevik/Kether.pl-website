import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import KetherApplication from './components/KetherAppMain/KetherApplication';
import { Provider } from 'react-redux';
import { appStore, persistedAppStore } from './redux/store';
import './global.css';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={appStore}>
                <PersistGate loading={null} persistor={persistedAppStore}>
                    <KetherApplication />
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
