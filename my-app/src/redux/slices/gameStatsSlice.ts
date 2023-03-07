import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStatEntry } from "../../models/gameStatsModels";

interface gameStatsSliceProps {
	gameStats: GameStatEntry[];
}

const initialState: gameStatsSliceProps = {
	gameStats: [],
};

const gameStatsSlice = createSlice({
	name: "gameStatsSlice",
	initialState: initialState,
	reducers: {
		setGameStats(state, action: PayloadAction<GameStatEntry[]>) {
			state.gameStats = action.payload;
		},
	},
});

export const gameStatsActions = gameStatsSlice.actions;
export const gameStatsReducer = gameStatsSlice.reducer;
