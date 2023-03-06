import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	GameStatEntry,
	DetailedGameStatEntry,
} from "../../models/gameStatsModels";
import { SteamUserDetails } from "./userDataSlice";

interface gameStatsSliceProps {
	gameStats: GameStatEntry[];
	gameStatsDetailed: DetailedGameStatEntry[];
}

const initialState: gameStatsSliceProps = {
	gameStats: [],
	gameStatsDetailed: [],
};

const gameStatsSlice = createSlice({
	name: "gameStatsSlice",
	initialState: initialState,
	reducers: {
		setGameStats(state, action: PayloadAction<GameStatEntry[]>) {
			state.gameStats = action.payload;
		},
		setDetailedGameStats(
			state,
			action: PayloadAction<DetailedGameStatEntry[]>
		) {
			state.gameStats = action.payload;
		},
		setUserDetailsInDetailedGameStat(
			state,
			action: PayloadAction<{
				steamUserDetails: SteamUserDetails;
				gameStatEntry: GameStatEntry;
			}>
		) {
			const objectToReplace = state.gameStatsDetailed.find(
				(arrayItem) =>
					arrayItem.SteamID === action.payload.gameStatEntry.SteamID
			);
			Object.assign(objectToReplace!, {
				...action.payload.gameStatEntry,
				userData: action.payload.steamUserDetails,
			});
			const updatedArray = state.gameStatsDetailed.filter(
				(arrayItem) => arrayItem.SteamID != action.payload.gameStatEntry.SteamID
			);
			updatedArray.push(objectToReplace!);
			state.gameStatsDetailed = updatedArray;
		},
	},
});

export const gameStatsActions = gameStatsSlice.actions;
export const gameStatsReducer = gameStatsSlice.reducer;
