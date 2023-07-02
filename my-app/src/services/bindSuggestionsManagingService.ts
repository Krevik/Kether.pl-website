import { useEffect } from 'react';
import { BindSuggestionEntry } from '../models/bindsModels';
import { AppState, appStore } from '../redux/store';
import { apiPaths } from '../utils/apiPaths';
import { bindSuggestionsActions } from '../redux/slices/bindSuggestionsSlice';
import { useSelector } from 'react-redux';
import { API_DOMAIN } from '../utils/envUtils';

export const bindSuggestionsManagingService = {
    useBindSuggestionsLoadingService: () => {
        useServerBindSuggestionsLoader();
    },
    getBindSuggestions: () => {
        fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/getBinds`,
            {
                method: 'get',
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((response: BindSuggestionEntry[]) => {
                appStore.dispatch(
                    bindSuggestionsActions.setBindSuggestions(response)
                );
            });
    },
    addNewBindSuggestion: (bind: BindSuggestionEntry) => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/addBind`,
            {
                method: 'post',
                body: new URLSearchParams({
                    author: bind.author,
                    text: bind.text,
                    proposedBy: bind.proposedBy!,
                }),
            }
        ).then(async (response) => {
            if (response.ok) {
                bindSuggestionsManagingService.getBindSuggestions();
                return response.json().then((response) => {
                    return response;
                });
            } else {
                throw new Error("Couldn't add the bind suggestion");
            }
        });
    },
    deleteBindSuggestion: (bind: BindSuggestionEntry) => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/deleteBind`,
            {
                method: 'post',
                body: new URLSearchParams({
                    id: `${bind.id}`,
                }),
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json().then((jsonedResponse) => {
                        bindSuggestionsManagingService.getBindSuggestions();
                        return jsonedResponse.message;
                    });
                } else {
                    throw new Error("Couldn't delete bind suggestion");
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
};

const useServerBindSuggestionsLoader = () => {
    useEffect(() => {
        bindSuggestionsManagingService.getBindSuggestions();
    }, []);
};
