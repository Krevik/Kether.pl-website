import { useEffect } from 'react';
import { BindEntry } from '../models/bindsModels';
import { appStore } from '../redux/store';
import { bindsActions } from '../redux/slices/bindsSlice';
import { apiPaths } from '../utils/apiPaths';
import { networkingUtils } from '../utils/networkingUtils';

export const bindsManagingService = {
    useBindsLoadingService: () => {
        useServerBindsLoader();
    },
    getBinds: async () => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/binds/GetBinds`;
        const binds = await networkingUtils.doFetch<BindEntry[]>(
            fetchUrl,
            'get'
        );
        if (binds.data) {
            appStore.dispatch(bindsActions.setBinds(binds.data));
        }
        if (binds.error) {
            throw binds.error;
        }
    },
    addNewBind: async (author: string, text: string) => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/binds/AddBind?author=${author}&text=${text}`;
        const addResult = await networkingUtils.doFetch(fetchUrl, 'post');
        if (addResult.data) {
            bindsManagingService.getBinds();
            return addResult.data;
        }
        if (addResult.error) {
            throw addResult.error;
        }
    },
    deleteBind: async (bindId: number) => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/binds/DeleteBind/${bindId}`;
        const deleteResult = await networkingUtils.doFetch(fetchUrl, 'delete');
        if (!deleteResult.error) {
            bindsManagingService.getBinds();
            return deleteResult.data;
        }
        if (deleteResult.error) {
            throw deleteResult.error;
        }
    },
    updateBind: async (newBindData: BindEntry) => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/binds/EditBind/${newBindData.id}`;
        const deleteResult = await networkingUtils.doFetch(
            fetchUrl,
            'put',
            newBindData
        );
        if (!deleteResult.error) {
            bindsManagingService.getBinds();
            return deleteResult.data;
        }
        if (deleteResult.error) {
            throw deleteResult.error;
        }
    },
};

const useServerBindsLoader = () => {
    useEffect(() => {
        bindsManagingService.getBinds();
    }, []);
};
