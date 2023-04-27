import { useEffect } from 'react';
import { apiPaths } from '../utils/apiPaths';
import { AppState, appStore } from '../redux/store';
import { serverInfoActions } from '../redux/slices/serverInfoSlice';
import { ServerInfo } from '../models/serverInfoModels';
import { useSelector } from 'react-redux';
import { networkingUtils } from '../utils/networkingUtils';

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
    const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/liveserverService/GetServerInfo`;

    networkingUtils.doFetch<ServerInfo>(fetchUrl, 'get').then((response) => {
        response.data &&
            appStore.dispatch(serverInfoActions.setServerInfo(response.data));
        response.error && console.error(response.error);
    });
};
