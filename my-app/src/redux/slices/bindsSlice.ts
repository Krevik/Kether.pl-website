import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BindEntry } from "../../models/bindsModels";

interface bindsSliceProps {
	binds: BindEntry[];
}

const initialState: bindsSliceProps = {
	binds: [],
};

const bindsSlice = createSlice({
	name: "bindsSlice",
	initialState: initialState,
	reducers: {
		setBinds(state, action: PayloadAction<BindEntry[]>) {
			state.binds = action.payload;
		},
	},
});

export const bindsActions = bindsSlice.actions;
export const bindsReducer = bindsSlice.reducer;
