import { useSelector } from 'react-redux';
import { AppState, appStore } from '../redux/store';
import { useCallback, useEffect } from 'react';
import { apiPaths } from '../utils/apiPaths';
import { networkingUtils } from '../utils/networkingUtils';
import {
    BindVotingEntry,
    BindVotingType,
    MappedBindVote,
} from '../models/bindsModels';
import { bindVotesActions } from '../redux/slices/bindVotesSlice';
import { bindVotesUtils } from '../utils/bindVotesUtils';

export const bindsVotingService = {
    useVotesLoadingService: () => {
        useServerBindsVotingLoader();
    },
    getVotes: async () => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/binds/GetVotes`;
        const votes = await networkingUtils.doFetch<BindVotingEntry[]>(
            fetchUrl,
            'get'
        );
        if (votes.data) {
            appStore.dispatch(bindVotesActions.setVotes(votes.data));
        }
        if (votes.error) {
            throw votes.error;
        }
    },
    setVote: async (
        voterSteamId: string | undefined,
        votedBindId: number,
        vote: BindVotingType,
        undoVote: boolean
    ): Promise<void> => {
        if (!voterSteamId) {
            return Promise.reject('No steam ID was given!');
        }
        let fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/binds/SetVote?votedBindId=${votedBindId}&voterSteamId=${voterSteamId}&vote=${vote}&undoVote=${undoVote}`;
        await networkingUtils.doFetch<string>(fetchUrl, 'post').then(() => {
            bindsVotingService.getVotes();
        });
    },
};

const useServerBindsVotingLoader = () => {
    const binds = useSelector((state: AppState) => state.bindsReducer.binds);
    const votes = useSelector(
        (state: AppState) => state.bindVotesReducer.votes
    );
    const steamUserId = useSelector(
        (state: AppState) => state.userDataReducer.userData?.steamid
    );
    useEffect(() => {
        bindsVotingService.getVotes();
    }, [binds]);

    useEffect(() => {
        if (steamUserId) {
            if (steamUserId) {
                const mappedBindVotes = bindVotesUtils.getMappedBindVotes(
                    votes,
                    steamUserId
                );
                appStore.dispatch(
                    bindVotesActions.setMappedBindVotes(mappedBindVotes)
                );
            }
        }
    }, [votes]);
};
