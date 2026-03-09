import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import { notificationManager } from '../utils/notificationManager';
import { API_CONFIG, SECONDARY_SERVER_CONFIG } from '../utils/constants';
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

const getSecondaryServerInfoUrl = (): string => {
    const [host, port] = SECONDARY_SERVER_CONFIG.IP.split(':');
    return `${API_PATHS.SERVER_INFO_ANY}/${host}/${port}`;
};

export const serverInfoService = {
    useServerInfoLoadingService: () => {
        const serverInfo = useSelector(
            (state: AppState) => state.serverInfoReducer.serverInfo
        );
        const secondaryServerInfo = useSelector(
            (state: AppState) => state.serverInfoReducer.secondaryServerInfo
        );
        const isLoading = useRef(false);

        useEffect(() => {
            if (!serverInfo || !secondaryServerInfo) {
                if (!isLoading.current) {
                    refreshServerInfo(serverInfo, secondaryServerInfo, isLoading);
                }
            }
            const refreshDataInterval = setInterval(() => {
                if (!isLoading.current) {
                    refreshServerInfo(serverInfo, secondaryServerInfo, isLoading);
                }
            }, API_CONFIG.REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshDataInterval);
            };
        }, [serverInfo, secondaryServerInfo]);
    },
};

const processPrimaryResult = (
    result: Awaited<ReturnType<typeof fetchServerInfoWithRetry>>,
    actualServerInfo: ServerInfo | undefined
) => {
    if (result.success && result.data) {
        appStore.dispatch(
            serverInfoActions.setServerInfo(withComputedStatus(result.data))
        );
        return;
    }
    if (result.error) {
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
        const isQueryTimeout = result.error.message?.includes('query timeout');
        if (isQueryTimeout) {
            console.warn('Game server query timeout - retaining last known data');
            if (!actualServerInfo) {
                appStore.dispatch(
                    serverInfoActions.setServerInfo(
                        createOfflineServerInfo('Kether.pl')
                    )
                );
            }
        } else {
            notificationManager.ERROR(getUserFriendlyMessage(result.error));
            appStore.dispatch(
                serverInfoActions.setServerInfo(
                    createOfflineServerInfo('Kether.pl')
                )
            );
        }
    }
};

const processSecondaryResult = (
    result: Awaited<ReturnType<typeof fetchServerInfoWithRetry>>,
    actualSecondaryServerInfo: ServerInfo | undefined
) => {
    if (result.success && result.data) {
        appStore.dispatch(
            serverInfoActions.setSecondaryServerInfo(
                withComputedStatus(result.data)
            )
        );
        return;
    }
    if (result.error) {
        errorLogger.logError(
            result.error,
            {
                component: 'ServerInfoService',
                action: 'fetch_secondary_server_info',
                attempts: result.attempts,
            },
            result.error.type,
            result.error.severity
        );
        const isQueryTimeout = result.error.message?.includes('query timeout');
        if (isQueryTimeout) {
            console.warn(
                'Secondary game server query timeout - retaining last known data'
            );
            if (!actualSecondaryServerInfo) {
                appStore.dispatch(
                    serverInfoActions.setSecondaryServerInfo(
                        createOfflineServerInfo(
                            SECONDARY_SERVER_CONFIG.FALLBACK_NAME
                        )
                    )
                );
            }
        } else {
            notificationManager.ERROR(getUserFriendlyMessage(result.error));
            appStore.dispatch(
                serverInfoActions.setSecondaryServerInfo(
                    createOfflineServerInfo(
                        SECONDARY_SERVER_CONFIG.FALLBACK_NAME
                    )
                )
            );
        }
    }
};

const refreshServerInfo = async (
    actualServerInfo: ServerInfo | undefined,
    actualSecondaryServerInfo: ServerInfo | undefined,
    isLoading: MutableRefObject<boolean>
) => {
    isLoading.current = true;
    const secondaryUrl = getSecondaryServerInfoUrl();
    const [primaryResult, secondaryResult] = await Promise.all([
        fetchServerInfoWithRetry(API_PATHS.SERVER_INFO),
        fetchServerInfoWithRetry(secondaryUrl),
    ]);

    try {
        processPrimaryResult(primaryResult, actualServerInfo);
        processSecondaryResult(secondaryResult, actualSecondaryServerInfo);
    } finally {
        isLoading.current = false;
    }
};
