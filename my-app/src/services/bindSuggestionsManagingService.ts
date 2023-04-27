import { useEffect } from 'react';
import { BindSuggestionEntry } from '../models/bindsModels';
import { appStore } from '../redux/store';
import { apiPaths } from '../utils/apiPaths';
import { bindSuggestionsActions } from '../redux/slices/bindSuggestionsSlice';
import { networkingUtils } from '../utils/networkingUtils';

export const bindSuggestionsManagingService = {
    useBindSuggestionsLoadingService: () => {
        useServerBindSuggestionsLoader();
    },
    getBindSuggestions: async () => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/bindSuggestions/GetBindSuggestions`;
        const bindSuggestions = await networkingUtils.doFetch<
            BindSuggestionEntry[]
        >(fetchUrl, 'get');
        if (bindSuggestions.data) {
            appStore.dispatch(
                bindSuggestionsActions.setBindSuggestions(bindSuggestions.data)
            );
        }
        if (bindSuggestions.error) {
            throw bindSuggestions.error;
        }
    },
    addBindSuggestion: async (bind: {
        author: string;
        text: string;
        proposedBy: string;
    }) => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/bindSuggestions/AddBindSuggestion`;
        const addResult = await networkingUtils.doFetch(fetchUrl, 'post', bind);
        if (addResult.data) {
            bindSuggestionsManagingService.getBindSuggestions();
            return addResult.data;
        }
        if (addResult.error) {
            throw addResult.error;
        }
    },
    deleteBindSuggestion: async (bindId: number) => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/bindSuggestions/DeleteBindSuggestion/${bindId}`;
        const deleteResult = await networkingUtils.doFetch(fetchUrl, 'delete');
        if (!deleteResult.error) {
            bindSuggestionsManagingService.getBindSuggestions();
            return true;
        } else {
            throw deleteResult.error;
        }
    },
};

const useServerBindSuggestionsLoader = () => {
    useEffect(() => {
        bindSuggestionsManagingService.getBindSuggestions();
    }, []);
};
