import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { notificationManager } from '../utils/notificationManager';
import { API_CONFIG } from '../utils/constants';
import { ErrorType, getUserFriendlyMessage } from '../utils/errorUtils';
import errorLogger from '../utils/errorLogger';
import { retryAsync } from '../utils/retryUtils';
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
    
    const result = await retryAsync(
        async () => {
            const response = await axios.get(API_PATHS.SERVER_INFO, {
                timeout: API_CONFIG.DEFAULT_TIMEOUT_MS,
            });
            return response.data as ServerInfo;
        },
        {
            maxAttempts: 3,
            initialDelay: 1000,
            retryCondition: (error) => {
                // Retry on network errors and 5xx server errors
                return error.type === ErrorType.NETWORK || 
                       (error.type === ErrorType.SERVER && error.code !== 500);
            },
        },
        {
            component: 'ServerInfoService',
            action: 'fetch_server_info',
        }
    );

    try {
        if (result.success && result.data) {
            const newServerInfo: ServerInfo = result.data;
            // Set status based on if the response data is not empty
            newServerInfo.status = Object.keys(newServerInfo).length > 0 ? '1' : '0';
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

            // Show user-friendly error message
            const userMessage = getUserFriendlyMessage(result.error);
            notificationManager.ERROR(userMessage);

            // Set offline server info as fallback
            const offlineServerInfo: ServerInfo = {
                name: 'Kether.pl',
                map: '–',
                players: '0',
                maxplayers: '0',
                bots: 0,
                playerdetails: [],
                status: '0',
            };
            appStore.dispatch(serverInfoActions.setServerInfo(offlineServerInfo));
        }
    } finally {
        isLoading.current = false;
    }
};
