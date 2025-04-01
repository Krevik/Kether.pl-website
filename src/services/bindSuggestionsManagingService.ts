import { useEffect } from 'react';
import { BindSuggestionEntry } from '../models/bindsModels';
import { appStore } from '../redux/store';
import { apiPaths } from '../utils/apiPaths';
import { bindSuggestionsActions } from '../redux/slices/bindSuggestionsSlice';
import { API_DOMAIN } from '../utils/envUtils';
import { notificationManager } from '../utils/notificationManager';

export const bindSuggestionsManagingService = {
    useBindSuggestionsLoadingService: () => {
        useServerBindSuggestionsLoader();
    },
    getBindSuggestions: async () => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/getBindSuggestions`,
                {
                    method: 'get',
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData: BindSuggestionEntry[] = await response.json();
            appStore.dispatch(
                bindSuggestionsActions.setBindSuggestions(responseData)
            );
        } catch (error) {
            notificationManager.ERROR(
                `Error while fetching bind suggestions: ${error.message}`
            );
        }
    },
    addNewBindSuggestion: async (bind: BindSuggestionEntry) => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/addBindSuggestion`,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        author: bind.author,
                        text: bind.text,
                        proposed_by: bind.proposedBy!,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            bindSuggestionsManagingService.getBindSuggestions();
            return await response.json();
        } catch (error) {
            notificationManager.ERROR(
                `Error while adding new bind suggestion: ${error.message}`
            );
            throw error;
        }
    },
    deleteBindSuggestion: async (bind: BindSuggestionEntry) => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/deleteBindSuggestion`,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: bind.id,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonedResponse = await response.json();
            bindSuggestionsManagingService.getBindSuggestions();
            return jsonedResponse.message;
        } catch (error) {
            notificationManager.ERROR(
                `Error while deleting bind suggestion: ${error.message}`
            );
            throw error;
        }
    },
};

const useServerBindSuggestionsLoader = () => {
    useEffect(() => {
        bindSuggestionsManagingService.getBindSuggestions();
    }, []);
};
