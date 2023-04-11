export type AttachedBindVoteData = {
    attachedBindID: number;
    Upvotes: number;
    Downvotes: number;
};

export type BindVote = {
    id?: number;
    voterSteamID?: string;
    votedBindID?: string;
    vote?: BindVotingType;
};

export enum BindVotingType {
    UPVOTE = 'Upvote',
    DOWNVOTE = 'Downvote',
}

export type BindEntry = {
    id: number;
    author: string;
    text: string;
    votingData?: AttachedBindVoteData;
};

export type BindSuggestionEntry = BindEntry & { proposedBy: string };
