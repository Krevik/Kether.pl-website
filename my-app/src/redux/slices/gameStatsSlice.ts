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
			state.gameStatsDetailed = action.payload;
		},
	},
});

export const gameStatsActions = gameStatsSlice.actions;
export const gameStatsReducer = gameStatsSlice.reducer;
