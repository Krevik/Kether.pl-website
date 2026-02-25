import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import { notificationManager } from '../utils/notificationManager';
import { API_CONFIG } from '../utils/constants';
import { ErrorType, getUserFriendlyMessage } from '../utils/errorUtils';
import errorLogger from '../utils/errorLogger';
import { retryAsync } from '../utils/retryUtils';

const createOfflineServerInfo = (fallbackName: string): ServerInfo => ({
    name: fallbackName,
    map: '–',
    players: '0',
    maxplayers: '0',
    bots: 0,
    playerdetails: [],
    status: '0',
});

const withComputedStatus = (serverInfo: ServerInfo): ServerInfo => ({
    ...serverInfo,
    status: Object.keys(serverInfo).length > 0 ? '1' : '0',
});

const fetchServerInfoWithRetry = (url: string) =>
    retryAsync(
        async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.DEFAULT_TIMEOUT_MS);

            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = (await response.json()) as ServerInfo;
                const dataStr = JSON.stringify(data);

                if (dataStr.includes('GDError') || dataStr.includes('Couldn\'t query')) {
                    throw new Error('Game server query timeout - backend could not reach game server');
                }

                return data;
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        },
        {
            maxAttempts: 3,
            initialDelay: 2000,
            retryCondition: (error) =>
                error.type === ErrorType.NETWORK ||
                (error.type === ErrorType.SERVER && error.code !== 500) ||
                error.message?.includes('query timeout'),
        },
        {
            component: 'ServerInfoService',
            action: 'fetch_server_info',
        }
    );

export const serverInfoService = {
    useServerInfoLoadingService: () => {
        const serverInfo = useSelector(
            (state: AppState) => state.serverInfoReducer.serverInfo
        );
        const isLoading = useRef(false);

        useEffect(() => {
            if (!serverInfo) {
                if (!isLoading.current) {
                    refreshServerInfo(serverInfo, isLoading);
                }
            }
            const refreshDataInterval = setInterval(() => {
                if (!isLoading.current) {
                    refreshServerInfo(serverInfo, isLoading);
                }
            }, API_CONFIG.REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshDataInterval);
            };
        }, [serverInfo]);
    },
};

const refreshServerInfo = async (
    actualServerInfo: ServerInfo | undefined,
    isLoading: MutableRefObject<boolean>
) => {
    isLoading.current = true;
    const result = await fetchServerInfoWithRetry(API_PATHS.SERVER_INFO);

    try {
        if (result.success && result.data) {
            const newServerInfo = withComputedStatus(result.data);
            appStore.dispatch(serverInfoActions.setServerInfo(newServerInfo));
        } else if (result.error) {
            // Log the error with full context
            errorLogger.logError(
                result.error,
                {
                    component: 'ServerInfoService',
                    action: 'fetch_server_info',
                    attempts: result.attempts,
                },
                result.error.type,
                result.error.severity
            );

            // Check if this is a query timeout (not a complete failure)
            const isQueryTimeout = result.error.message?.includes('query timeout');
            
            if (isQueryTimeout) {
                // Don't spam notifications for query timeouts
                // Don't update the server info - keep showing last known data
                console.warn('Game server query timeout - retaining last known data');
                
                // If we have no previous data, then show offline
                if (!actualServerInfo) {
                    const offlineServerInfo = createOfflineServerInfo('Kether.pl');
                    appStore.dispatch(serverInfoActions.setServerInfo(offlineServerInfo));
                }
            } else {
                // Real network/server error - show notification and set offline
                const userMessage = getUserFriendlyMessage(result.error);
                notificationManager.ERROR(userMessage);

                const offlineServerInfo = createOfflineServerInfo('Kether.pl');
                appStore.dispatch(serverInfoActions.setServerInfo(offlineServerInfo));
            }
        }
    } finally {
        isLoading.current = false;
    }
};
