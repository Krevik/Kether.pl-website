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
            .then((bindEntries: BindEntry[]) => {
                return getRawBindVotings().then((bindVotings) => {
                    let selfBindVotes: BindVote[] = [];
                    if (userSteamID) {
                        selfBindVotes = bindVotings.filter(
                            (testBind) => testBind.voterSteamID === userSteamID
                        );
                    }

                    const mappedBindVotings: AttachedBindVoteData[] = [];
                    bindVotings?.forEach((rawBindVoting) => {
                        const vote: BindVotingType =
                            rawBindVoting.vote === 'Upvote'
                                ? BindVotingType.UPVOTE
                                : BindVotingType.DOWNVOTE;
                        const upVote: boolean = vote === BindVotingType.UPVOTE;
                        const downVote: boolean =
                            vote === BindVotingType.DOWNVOTE;
                        const existingVotingData = mappedBindVotings.find(
                            (testBindVote: AttachedBindVoteData) =>
                                testBindVote.attachedBindID ===
                                Number(rawBindVoting.votedBindID)
                        );

                        if (existingVotingData) {
                            upVote && existingVotingData.Upvotes++;
                            downVote && existingVotingData.Downvotes++;
                        } else {
                            const newVotingData: AttachedBindVoteData = {
                                id: Number(rawBindVoting.votedBindID),
                                attachedBindID: Number(
                                    rawBindVoting.votedBindID
                                ),
                                Upvotes: upVote ? 1 : 0,
                                Downvotes: downVote ? 1 : 0,
                            };
                            mappedBindVotings.push(newVotingData);
                        }
                    });

                    mappedBindVotings?.forEach(
                        (mappedBindVoting: AttachedBindVoteData) => {
                            const bindEntryToAttachTo = bindEntries.find(
                                (testBindEntry) =>
                                    testBindEntry.id ===
                                    mappedBindVoting.attachedBindID
                            );
                            if (bindEntryToAttachTo) {
                                bindEntryToAttachTo.votingData =
                                    mappedBindVoting;
                            }
                        }
                    );

                    selfBindVotes?.forEach((selfBindVote) => {
                        const existingBind = bindEntries.find(
                            (bindEntry) =>
                                bindEntry.id ===
                                Number(selfBindVote.votedBindID)
                        );
                        if (existingBind) {
                            existingBind.votingData!.selfVote =
                                selfBindVote.vote;
                        }
                    });

                    appStore.dispatch(bindsActions.setBinds(bindEntries));
                });
            })
            .catch((error) => {
                notificationManager.ERROR(
                    `Error while fetching binds: ${error.message}`
                );
            });
    },
    setVote: (votingData: BindVote, undoVote?: boolean): Promise<string> => {
        const urlSearchParams = new URLSearchParams({
            voterSteamID: votingData.voterSteamID!,
            votedBindID: votingData.votedBindID!,
            vote: votingData.vote!,
        });
        votingData.id && urlSearchParams.set('id', votingData.id.toString());
        return fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${
                apiPaths.BIND_VOTES_PATH
            }/${undoVote ? 'deleteBindVoting' : 'addBindVoting'}`,
            {
                method: 'post',
                body: urlSearchParams,
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

const getRawBindVotings = (): Promise<BindVote[]> => {
    return fetch(
        `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_VOTES_PATH}/getBindVotings`,
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
        .catch((error) => {
            notificationManager.ERROR(
                `Error while fetching bind votes: ${error.message}`
            );
            return [];
        });
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
