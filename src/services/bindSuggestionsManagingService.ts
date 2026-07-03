import { useEffect, useState } from 'react';
import { BindSuggestionEntry } from '../models/bindsModels';
import { appStore, AppState } from '../redux/store';
import { apiPaths } from '../utils/apiPaths';
import { bindSuggestionsActions } from '../redux/slices/bindSuggestionsSlice';
import { API_DOMAIN } from '../utils/envUtils';
import { notificationManager } from '../utils/notificationManager';
import { useSelector } from 'react-redux';
import { handleAuthError } from '../utils/authUtils';
import { apiFetch } from '../utils/apiClient';

export const bindSuggestionsManagingService = {
    useBindSuggestionsLoadingService: () => {
        return useServerBindSuggestionsLoader();
    },
    getBindSuggestions: () => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/getBindSuggestions`,
            {
                method: 'get',
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData: BindSuggestionEntry[]) => {
                appStore.dispatch(
                    bindSuggestionsActions.setBindSuggestions(responseData)
                );
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while fetching bind suggestions: ${error.message}`
                );
            });
    },
    addNewBindSuggestion: (bind: BindSuggestionEntry) => {
        return apiFetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/addBindSuggestion`,
            {
                method: 'post',
                auth: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: bind.author,
                    text: bind.text,
                }),
            }
        )
            .then((response) => {
                if (handleAuthError(response)) {
                    throw new Error('Authentication required');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                bindSuggestionsManagingService.getBindSuggestions();
                return response.json();
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while adding new bind suggestion: ${error.message}`
                );
                throw error;
            });
    },
    deleteBindSuggestion: (bind: BindSuggestionEntry) => {
        return apiFetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/deleteBindSuggestion`,
            {
                method: 'post',
                auth: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: bind.id,
                }),
            }
        )
            .then((response) => {
                if (handleAuthError(response)) {
                    throw new Error('Authentication required');
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonedResponse) => {
                bindSuggestionsManagingService.getBindSuggestions();
                return jsonedResponse.message;
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while deleting bind suggestion: ${error.message}`
                );
                throw error;
            });
    },
};

const useServerBindSuggestionsLoader = () => {
    const userData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        bindSuggestionsManagingService.getBindSuggestions().finally(() => {
            setIsLoading(false);
        });
    }, [userData]);
    return isLoading;
};
