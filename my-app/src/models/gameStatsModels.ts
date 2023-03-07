import { SteamUserDetails } from "../redux/slices/userDataSlice";

export type GameStatEntry = {
	SteamID: string;
	Hunter_Skeets: number;
	Witch_Crowns: number;
	Tongue_Cuts: number;
	Smoker_Self_Clears: number;
	Tank_Rocks_Skeeted: number;
	Hunter_High_Pounces_25: number;
	Death_Charges: number;
	Commons_Killed: number;
	Friendly_Fire_Done: number;
	Friendly_Fire_Received: number;
	userData?: SteamUserDetails;
};
