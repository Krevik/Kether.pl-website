import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStatEntry } from "../../models/gameStatsModels";

interface gameStatsSliceProps {
	gameStats: GameStatEntry[];
	totalRecords: number;
}

const initialState: gameStatsSliceProps = {
	gameStats: [],
	totalRecords: 0,
};

const gameStatsSlice = createSlice({
	name: "gameStatsSlice",
	initialState: initialState,
	reducers: {
		setGameStats(state, action: PayloadAction<GameStatEntry[]>) {
			state.gameStats = action.payload;
		},
		setTotalRecords(state, action: PayloadAction<number>) {
			state.totalRecords = action.payload;
		},
	},
});

export const gameStatsActions = gameStatsSlice.actions;
export const gameStatsReducer = gameStatsSlice.reducer;
