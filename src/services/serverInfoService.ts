import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { notificationManager } from '../utils/notificationManager';
import { API_CONFIG } from '../utils/constants';
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
    try {
        const response = await axios.get(API_PATHS.SERVER_INFO);
        const newServerInfo: ServerInfo = response.data as ServerInfo;
        // Set status based on if the response data is not empty
        newServerInfo.status = Object.keys(newServerInfo).length > 0 ? '1' : '0';

        appStore.dispatch(serverInfoActions.setServerInfo(newServerInfo));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        notificationManager.ERROR(
            `Error while fetching server info: ${errorMessage}`
        );
        // If there's an error, set the status to offline
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
    } finally {
        isLoading.current = false;
    }
};
