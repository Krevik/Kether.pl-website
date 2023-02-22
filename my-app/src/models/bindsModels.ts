export type BindEntryMultipleTexts = {
	author: string;
	texts: string[];
};

export enum BindVotingType {
	UP = "Upvote",
	DOWN = "Downvote",
}

export type BindVotingEntry = {
	type: BindVotingType;
	userSteamID: string;
};

export type BindEntry = {
	author: string;
	text: string;
	bindVotingEntries: BindVotingEntry[];
};
