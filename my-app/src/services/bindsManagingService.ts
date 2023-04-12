import { useEffect } from 'react';
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

export const bindsManagingService = {
    useBindsLoadingService: (steamUserID?: string) => {
        useServerBindsLoader(steamUserID);
    },
    getBinds: (userSteamID?: string) => {
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
                    let selfBindVotes: BindVote[] = [];
                    if (userSteamID) {
                        selfBindVotes = bindVotings.filter(
                            (testBind) => testBind.voterSteamID === userSteamID
                        );
                    }

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

                    userSteamID &&
                        selfBindVotes.forEach((selfBindVote) => {
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
            });
    },
    setVote: (votingData: BindVote): Promise<string> => {
        const urlSearchParams = new URLSearchParams({
            voterSteamID: votingData.voterSteamID!,
            votedBindID: votingData.votedBindID!,
            vote: votingData.vote!,
        });
        votingData.id && urlSearchParams.set('id', votingData.id.toString());
        return fetch(
            `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/vote`,
            {
                method: 'post',
                body: urlSearchParams,
            }
        )
            .then((response) => {
                return response.text();
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
    deleteVote: (votingData: BindVote) => {
        return;
    },
    addNewBind: (bind: BindEntry, steamUserID?: string) => {
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
                bindsManagingService.getBinds(steamUserID);
                return response.json().then((response) => {
                    return response;
                });
            } else {
                throw new Error("Couldn't add the bind");
            }
        });
    },
    deleteBind: (bind: BindEntry, steamUserID?: string) => {
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
                        bindsManagingService.getBinds(steamUserID);
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
    updateBind: (newBindData: BindEntry, steamUserID?: string) => {
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
                        bindsManagingService.getBinds(steamUserID);
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

const useServerBindsLoader = (steamUserID?: string) => {
    const userData = useSelector(
        (state: AppState) => state.userDataReducer.userData
    );
    useEffect(() => {
        bindsManagingService.getBinds(steamUserID);
    }, []);
    useEffect(() => {
        bindsManagingService.getBinds(steamUserID);
    }, [userData]);
};
