type SteamPlayerServerData = {
	index: number;
	name: string;
	score: number;
	duration: number;
}

export type ServerInfo = {
	map: string;
	maxplayers: string;
	name: string;
	password: string;
	players: string;
	status: string;
};

export type SteamServerInfo = {
	playerCount: number;
	players: SteamPlayerServerData[]
}
