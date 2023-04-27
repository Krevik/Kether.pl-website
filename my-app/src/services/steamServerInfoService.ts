import { useEffect } from 'react';
import { apiPaths } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { SteamServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';

const REFRESH_INTERVAL_MS = 5000;
export const steamServerInfoService = {
    useSteamServerInfoLoadingService: () => {
        const steamServerInfo = useSelector(
            (state: AppState) => state.serverInfoReducer.steamServerInfo
        );

        useEffect(() => {
            if (!steamServerInfo) {
                getSteamServerInfo();
            }

            const refreshDataInterval = setInterval(() => {
                getSteamServerInfo();
            }, REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshDataInterval);
            };
        }, []);
    },
};

const getSteamServerInfo = () => {
    // fetch(
    //     `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/serverInfo`,
    //     {
    //         method: 'get',
    //     }
    // )
    //     .then((response) => {
    //         return response.json();
    //     })
    //     .then((response: SteamServerInfo) => {
    //         appStore.dispatch(serverInfoActions.setSteamServerInfo(response));
    //     });
};
