export enum BindVotingType {
    Upvote,
    Downvote,
}

export type BindVotingEntry = {
    id: number;
    votedBindId: number;
    voterSteamId: string;
    vote: BindVotingType;
};

export type BindEntry = {
    id?: number;
    author: string;
    text: string;
};

export type BindSuggestionEntry = {
    id?: number;
    author: string;
    text: string;
    proposedBy: string;
};

export type MappedBindVote = {
    bindId: number;
    Upvotes: number;
    Downvotes: number;
    isSelfUpVoted: boolean;
    isSelfDownVoted: boolean;
};
