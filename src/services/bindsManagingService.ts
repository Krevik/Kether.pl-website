import { useEffect, useState } from 'react';
import {
    AttachedBindVoteData,
    BindEntry,
    BindVote,
    BindVotingType,
} from '../models/bindsModels';
import { AppState, appStore } from '../redux/store';
import { bindsActions } from '../redux/slices/bindsSlice';
import { apiPaths } from '../utils/apiPaths';
import { useSelector } from 'react-redux';
import { API_DOMAIN } from '../utils/envUtils';
import { notificationManager } from '../utils/notificationManager';


export const bindsManagingService = {
    useBindsLoadingService: (steamUserID?: string) => {
        return useServerBindsLoader(steamUserID ? steamUserID : undefined);
    },
    getBinds: (userSteamID?: string) => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/getBinds`,
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
        .then((bindEntries: any[]) => {
            // Map backend format to frontend format
            const mappedBinds: BindEntry[] = bindEntries.map((bind) => {
                const upvoteCount = bind.upvote?.length || 0;
                const downvoteCount = bind.downvote?.length || 0;
                
                let selfVote: BindVotingType | undefined = undefined;
                if (userSteamID) {
                    const steamIDNum = Number(userSteamID);
                    if (bind.upvote?.includes(steamIDNum)) {
                        selfVote = BindVotingType.UPVOTE;
                    } else if (bind.downvote?.includes(steamIDNum)) {
                        selfVote = BindVotingType.DOWNVOTE;
                    }
                }
                
                return {
                    id: bind.id,
                    author: bind.author,
                    text: bind.text,
                    votingData: {
                        id: bind.id,
                        attachedBindID: bind.id,
                        Upvotes: upvoteCount,
                        Downvotes: downvoteCount,
                        selfVote: selfVote,
                    },
                };
            });
            
            appStore.dispatch(bindsActions.setBinds(mappedBinds));
        })
        .catch((error) => {
            notificationManager.ERROR(
                `Error while fetching binds: ${error.message}`
            );
        });
    },
    setVote: (votingData: BindVote, undoVote?: boolean): Promise<string> => {
        // Convert to numbers
        const requestBody = {
            voter_steam_id: Number(votingData.voterSteamID),
            voted_bind_id: Number(votingData.votedBindID),
            vote: votingData.vote!,
        };
        
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${
                apiPaths.BIND_VOTES_PATH
            }/${undoVote ? 'deleteBindVoting' : 'addBindVoting'}`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',  // ← Changed to JSON
                },
                body: JSON.stringify(requestBody),  // ← Send JSON, not URLSearchParams
            }
        )
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            bindsManagingService.getBinds(votingData.voterSteamID);
            return response.text();
        })
        .catch((error) => {
            notificationManager.ERROR(
                `Error while setting vote: ${error.message}`
            );
            throw error;
        });
    },
    addNewBind: (bind: BindEntry, steamUserID?: string) => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/addBind`,
            {
                method: 'post',
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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                bindsManagingService.getBinds(steamUserID);
                return response.json();
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while adding new bind: ${error.message}`
                );
                throw error;
            });
    },
    deleteBind: (bind: BindEntry, steamUserID?: string) => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/deleteBind`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: bind.id,
                }),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonedResponse) => {
                bindsManagingService.getBinds(steamUserID);
                return jsonedResponse.message;
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while deleting bind: ${error.message}`
                );
                throw error;
            });
    },
    updateBind: (newBindData: BindEntry, steamUserID?: string) => {
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/updateBind`,
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: newBindData.id,
                    author: `${newBindData.author}`,
                    text: `${newBindData.text}`,
                }),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonedResponse) => {
                bindsManagingService.getBinds(steamUserID);
                return jsonedResponse.message;
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while updating bind: ${error.message}`
                );
                throw error;
            });
    },
};

const useServerBindsLoader = (steamUserID?: string) => {
    const userData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        bindsManagingService.getBinds(steamUserID).finally(() => {
            setIsLoading(false);
        });
    }, [userData, steamUserID]);
    return isLoading;
};
