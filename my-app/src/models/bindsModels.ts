export enum BindVotingType {
	UP = "Upvote",
	DOWN = "Downvote",
}

export type BindVotingEntry = {
	type: BindVotingType;
	userSteamID: string;
};

export type BindEntry = {
	id: number;
	author: string;
	text: string;
	bindVotingEntries: BindVotingEntry[];
};

export type BindSuggestionEntry = BindEntry & { proposedBy: string };
