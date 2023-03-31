import { useEffect } from 'react';
import { apiPaths } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';

const REFRESH_INTERVAL_MS = 5000;
export const serverInfoService = {
    useServerInfoLoadingService: () => {
        const serverInfo = useSelector(
            (state: AppState) => state.serverInfoReducer.serverInfo
        );

        useEffect(() => {
            if (!serverInfo) {
                getServerInfo();
            }
            const refreshDataInterval = setInterval(() => {
                getServerInfo();
            }, REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshDataInterval);
            };
        }, []);
    },
};

const getServerInfo = () => {
    fetch(`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}/serverInfo`, {
        method: 'post',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Security-Policy': 'upgrade-insecure-requests',
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((response: ServerInfo) => {
            appStore.dispatch(serverInfoActions.setServerInfo(response));
        });
};
