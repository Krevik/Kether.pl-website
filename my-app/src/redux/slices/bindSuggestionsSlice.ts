import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BindEntry } from "../../models/bindsModels";

interface bindsSliceProps {
	bindSuggestions: BindEntry[];
}

const initialState: bindsSliceProps = {
	bindSuggestions: [],
};

const bindSuggestionsSlice = createSlice({
	name: "bindSuggestions",
	initialState: initialState,
	reducers: {
		setBindSuggestions(state, action: PayloadAction<BindEntry[]>) {
			state.bindSuggestions = action.payload;
		},
	},
});

export const bindSuggestionsActions = bindSuggestionsSlice.actions;
export const bindSuggestionsReducer = bindSuggestionsSlice.reducer;
