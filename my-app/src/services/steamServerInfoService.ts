import { MutableRefObject, useEffect, useRef } from 'react';
import { API_PATHS } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo, SteamServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { areObjectsEqual } from '../utils/utils';

const REFRESH_INTERVAL_MS = 5000;
export const steamServerInfoService = {
    useSteamServerInfoLoadingService: () => {
        const steamServerInfo = useSelector(
            (state: AppState) => state.serverInfoReducer.steamServerInfo
        );
        const isLoading = useRef(false);

        useEffect(() => {
            if (!steamServerInfo) {
                if (!isLoading.current) {
                    refreshServerInfo(steamServerInfo, isLoading);
                }
            }
            const refreshDataInterval = setInterval(() => {
                if (!isLoading.current) {
                    refreshServerInfo(steamServerInfo, isLoading);
                }
            }, REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshDataInterval);
            };
        }, []);
    },
};

const refreshServerInfo = (
    actualServerInfo: SteamServerInfo | undefined,
    isLoading: MutableRefObject<boolean>
) => {
    isLoading.current = true;
    return axios
        .get(API_PATHS.SERVER_INFO_STEAM)
        .then((response) => {
            const newServerInfo: SteamServerInfo =
                response.data as SteamServerInfo;
            if (!areObjectsEqual(newServerInfo, actualServerInfo)) {
                appStore.dispatch(
                    serverInfoActions.setSteamServerInfo(newServerInfo)
                );
            }
        })
        .finally(() => {
            isLoading.current = false;
        });
};
