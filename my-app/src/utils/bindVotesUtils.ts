import {
    BindVotingEntry,
    BindVotingType,
    MappedBindVote,
} from '../models/bindsModels';

export const bindVotesUtils = {
    countVotesForBind: (
        bindId: number,
        bindsVotingData: MappedBindVote[] | undefined,
        vote: BindVotingType
    ) => {
        if (!bindsVotingData) return 0;
        const votingDataForBind = bindsVotingData.find(
            (element) => element.bindId === bindId
        );

        if (!votingDataForBind) return 0;
        return vote === BindVotingType.Upvote
            ? votingDataForBind.Upvotes
            : votingDataForBind.Downvotes;
    },
    isSelfVoted: (
        bindId: number,
        votes: BindVotingEntry[] | undefined,
        steamUserId: string | undefined,
        votingType: BindVotingType
    ) => {
        if (!votes) return false;
        if (!steamUserId) return false;
        const votesOfUser = votes.find(
            (element) =>
                element.voterSteamId === steamUserId &&
                String(BindVotingType[element.vote]) === votingType.toString()
        );
        return votesOfUser !== undefined;
    },
    getMappedBindVotes: (votes: BindVotingEntry[], steamUserId: string) => {
        const mappedBindVotes: MappedBindVote[] = [];
        votes.forEach((vote) => {
            if (
                vote &&
                vote.vote !== null &&
                vote.votedBindId &&
                vote.voterSteamId
            ) {
                const existingMapForBind: MappedBindVote | undefined =
                    mappedBindVotes.find((element) => {
                        return element.bindId === vote.votedBindId;
                    });

                if (existingMapForBind) {
                    //alternate existing map
                    if (vote.vote === BindVotingType.Upvote) {
                        existingMapForBind.Upvotes++;
                        if (vote.voterSteamId === steamUserId) {
                            existingMapForBind.isSelfUpVoted = true;
                        }
                    }
                    if (vote.vote === BindVotingType.Downvote) {
                        existingMapForBind.Downvotes++;
                        if (vote.voterSteamId === steamUserId) {
                            existingMapForBind.isSelfDownVoted = true;
                        }
                    }
                } else {
                    //create new map
                    const isUpvote =
                        String(BindVotingType[vote.vote]) ===
                        BindVotingType.Upvote.toString();
                    const isDownvote =
                        String(BindVotingType[vote.vote]) ===
                        BindVotingType.Downvote.toString();
                    const mappedBindVote: MappedBindVote = {
                        Downvotes: isDownvote ? 1 : 0,
                        Upvotes: isUpvote ? 1 : 0,
                        bindId: vote.votedBindId,
                        isSelfDownVoted:
                            vote.voterSteamId === steamUserId &&
                            String(BindVotingType[vote.vote]) ===
                                BindVotingType.Downvote.toString(),
                        isSelfUpVoted:
                            vote.voterSteamId === steamUserId &&
                            String(BindVotingType[vote.vote]) ===
                                BindVotingType.Upvote.toString(),
                    };
                    mappedBindVotes.push(mappedBindVote);
                }
            }
        });
        return mappedBindVotes;
    },
};
