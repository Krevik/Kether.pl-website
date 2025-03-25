export type PlayerDetails = {
    name: string;
    score: number;
    duration: number;
};

export type ServerInfo = {
	map: string;
	maxplayers: string;
	name: string;
	players: string;
    bots: number;
    playerdetails: PlayerDetails[];
	status: string;
};