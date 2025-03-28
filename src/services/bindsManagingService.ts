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
import { API_DOMAIN } from '../utils/envUtils';
import { notificationManager } from '../utils/notificationManager';

export const bindsManagingService = {
    useBindsLoadingService: (steamUserID?: string) => {
        useServerBindsLoader(steamUserID ? steamUserID : undefined);
    },
    getBinds: async (userSteamID?: string) => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/getBinds`,
                {
                    method: 'get',
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const bindEntries: BindEntry[] = await response.json();
            const bindVotings = await getRawBindVotings();
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
                const downVote: boolean = vote === BindVotingType.DOWNVOTE;
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
                        attachedBindID: Number(rawBindVoting.votedBindID),
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
                        bindEntryToAttachTo.votingData = mappedBindVoting;
                    }
                }
            );

            selfBindVotes?.forEach((selfBindVote) => {
                const existingBind = bindEntries.find(
                    (bindEntry) =>
                        bindEntry.id === Number(selfBindVote.votedBindID)
                );
                if (existingBind) {
                    existingBind.votingData!.selfVote = selfBindVote.vote;
                }
            });

            appStore.dispatch(bindsActions.setBinds(bindEntries));
        } catch (error) {
            notificationManager.ERROR(
                `Error while fetching binds: ${error.message}`
            );
        }
    },
    setVote: async (votingData: BindVote, undoVote?: boolean): Promise<string> => {
        const urlSearchParams = new URLSearchParams({
            voterSteamID: votingData.voterSteamID!,
            votedBindID: votingData.votedBindID!,
            vote: votingData.vote!,
        });
        votingData.id && urlSearchParams.set('id', votingData.id.toString());
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${
                    apiPaths.BINDS_PATH
                }/${undoVote ? 'vote/delete' : 'vote'}`,
                {
                    method: 'post',
                    body: urlSearchParams,
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            bindsManagingService.getBinds(votingData.voterSteamID);
            return await response.text();
        } catch (error) {
            notificationManager.ERROR(
                `Error while setting vote: ${error.message}`
            );
            throw error;
        }
    },
    addNewBind: async (bind: BindEntry, steamUserID?: string) => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/addBind`,
                {
                    method: 'post',
                    body: new URLSearchParams({
                        author: bind.author,
                        text: bind.text,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            bindsManagingService.getBinds(steamUserID);
            return await response.json();
        } catch (error) {
            notificationManager.ERROR(
                `Error while adding new bind: ${error.message}`
            );
            throw error;
        }
    },
    deleteBind: async (bind: BindEntry, steamUserID?: string) => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/deleteBind`,
                {
                    method: 'post',
                    body: new URLSearchParams({
                        id: `${bind.id}`,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonedResponse = await response.json();
            bindsManagingService.getBinds(steamUserID);
            return jsonedResponse.message;
        } catch (error) {
            notificationManager.ERROR(
                `Error while deleting bind: ${error.message}`
            );
            throw error;
        }
    },
    updateBind: async (newBindData: BindEntry, steamUserID?: string) => {
        try {
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/updateBind`,
                {
                    method: 'post',
                    body: new URLSearchParams({
                        id: `${newBindData.id}`,
                        author: `${newBindData.author}`,
                        text: `${newBindData.text}`,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonedResponse = await response.json();
            bindsManagingService.getBinds(steamUserID);
            return jsonedResponse.message;
        } catch (error) {
            notificationManager.ERROR(
                `Error while updating bind: ${error.message}`
            );
            throw error;
        }
    },
};

const getRawBindVotings = async (): Promise<BindVote[]> => {
    try {
        const response = await fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/votes`,
            {
                method: 'get',
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        notificationManager.ERROR(
            `Error while fetching bind votes: ${error.message}`
        );
        return [];
    }
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
