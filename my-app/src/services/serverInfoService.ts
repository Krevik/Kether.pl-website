import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { areObjectsEqual } from '../utils/utils';

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

const refreshServerInfo = (
    actualServerInfo: ServerInfo | undefined,
    isLoading: MutableRefObject<boolean>
) => {
    isLoading.current = true;
    return axios
        .get(API_PATHS.SERVER_INFO_LIVESERVER)
        .then((response) => {
            const newServerInfo: ServerInfo = response.data as ServerInfo;
            appStore.dispatch(serverInfoActions.setServerInfo(newServerInfo));
        })
        .finally(() => {
            isLoading.current = false;
        });
};
