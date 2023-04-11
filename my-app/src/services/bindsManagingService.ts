import { useEffect } from 'react';
import {
    AttachedBindVoteData,
    BindEntry,
    BindVote,
    BindVotingType,
} from '../models/bindsModels';
import { appStore } from '../redux/store';
import { bindsActions } from '../redux/slices/bindsSlice';
import { apiPaths } from '../utils/apiPaths';

export const bindsManagingService = {
    useBindsLoadingService: () => {
        useServerBindsLoader();
    },
    getBinds: () => {
        fetch(
            `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/getBinds`,
            {
                method: 'get',
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((bindEntries: BindEntry[]) => {
                getRawBindVotings().then((bindVotings: BindVote[]) => {
                    const mappedBindVotings: AttachedBindVoteData[] = [];
                    bindVotings &&
                        bindVotings.length > 0 &&
                        bindVotings.forEach((rawBindVoting) => {
                            const vote: BindVotingType =
                                rawBindVoting.vote === 'Upvote'
                                    ? BindVotingType.UPVOTE
                                    : BindVotingType.DOWNVOTE;
                            const upVote: boolean =
                                vote === BindVotingType.UPVOTE;
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
                                    attachedBindID: Number(
                                        rawBindVoting.votedBindID
                                    ),
                                    Upvotes: upVote ? 1 : 0,
                                    Downvotes: downVote ? 1 : 0,
                                };
                                mappedBindVotings.push(newVotingData);
                            }
                        });
                    mappedBindVotings.forEach(
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
                    appStore.dispatch(bindsActions.setBinds(bindEntries));
                });
            });
    },
    addNewBind: (bind: BindEntry) => {
        return fetch(
            `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/addBind`,
            {
                method: 'post',
                body: new URLSearchParams({
                    author: bind.author,
                    text: bind.text,
                }),
            }
        ).then(async (response) => {
            if (response.ok) {
                bindsManagingService.getBinds();
                return response.json().then((response) => {
                    return response;
                });
            } else {
                throw new Error("Couldn't add the bind");
            }
        });
    },
    deleteBind: (bind: BindEntry) => {
        return fetch(
            `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/deleteBind`,
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
                        bindsManagingService.getBinds();
                        return jsonedResponse.message;
                    });
                } else {
                    throw new Error("Couldn't delete bind");
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
    updateBind: (newBindData: BindEntry) => {
        return fetch(
            `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/updateBind`,
            {
                method: 'post',
                body: new URLSearchParams({
                    id: `${newBindData.id}`,
                    author: `${newBindData.author}`,
                    text: `${newBindData.text}`,
                }),
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json().then((jsonedResponse) => {
                        bindsManagingService.getBinds();
                        return jsonedResponse.message;
                    });
                } else {
                    throw new Error("Couldn't update bind");
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
};

const getRawBindVotings = (): Promise<BindVote[]> => {
    return fetch(
        `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/votes`,
        {
            method: 'get',
        }
    )
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((response: BindVote[]) => {
            return response;
        });
};

const useServerBindsLoader = () => {
    useEffect(() => {
        bindsManagingService.getBinds();
    }, []);
};
