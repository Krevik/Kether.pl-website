import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authenticationSliceProps {
	userID?: string;
}

const initialState: authenticationSliceProps = {
	userID: undefined,
};

const authenticationSlice = createSlice({
	name: "authenticationSlice",
	initialState: initialState,
	reducers: {
		setUserID(state, action: PayloadAction<string | undefined>) {
			state.userID = action.payload;
		},
	},
});

export const authenticationActions = authenticationSlice.actions;
export const authenticationReducer = authenticationSlice.reducer;
