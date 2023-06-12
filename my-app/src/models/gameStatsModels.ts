import { SteamUserDetails } from '../redux/slices/userDataSlice';

export type GameStatEntry = {
    SteamID: string;
    LastKnownSteamName: string;
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
    Damage_Done_To_Survivors: number;
    Damage_Done_To_SI: number;
    Damage_Done_To_Tanks: number;
    userData?: SteamUserDetails;
    profileUrl: string;
    avatarMediumSrc: string;
    Gameplay_Time: number;
    Commons_Killed_Per_Round_Average?: number;
    Hunters_Skeeted_Per_Round_Average?: number;
    Damage_Done_To_SI_Per_Round_Average?: number;
    Friendly_Fire_Done_Per_Round_Average?: number;
    Total_Score?: number;
};

export type GameStatLazyLoadingParams = {
    first: number;
    rows: number;
    page: number;
    sortField?: string;
    sortOrder?: number;
    query?: string;
};
