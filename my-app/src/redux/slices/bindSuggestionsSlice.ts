import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BindEntry, BindSuggestionEntry } from "../../models/bindsModels";

interface bindsSliceProps {
	bindSuggestions: BindSuggestionEntry[];
}

const initialState: bindsSliceProps = {
	bindSuggestions: [],
};

const bindSuggestionsSlice = createSlice({
	name: "bindSuggestions",
	initialState: initialState,
	reducers: {
		setBindSuggestions(state, action: PayloadAction<BindSuggestionEntry[]>) {
			state.bindSuggestions = action.payload;
		},
	},
});

export const bindSuggestionsActions = bindSuggestionsSlice.actions;
export const bindSuggestionsReducer = bindSuggestionsSlice.reducer;
