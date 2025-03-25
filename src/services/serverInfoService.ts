import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import axios from 'axios';

const REFRESH_INTERVAL_MS = 5000;
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
            }, REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshDataInterval);
            };
        }, []);
    },
};

const refreshServerInfo = async (
    actualServerInfo: ServerInfo | undefined,
    isLoading: MutableRefObject<boolean>
) => {
    isLoading.current = true;
    try {
        const response = await axios
            .get(API_PATHS.SERVER_INFO);
        const newServerInfo: ServerInfo = response.data as ServerInfo;
        // Set status based on if there is any players or bots on the server.
        // newServerInfo.status = (newServerInfo.players + newServerInfo.bots) > 0 ? '1' : '0';
        appStore.dispatch(serverInfoActions.setServerInfo(newServerInfo));
    } finally {
        isLoading.current = false;
    }
};
