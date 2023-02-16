import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authenticationSliceProps {
	userID?: string;
	userData?: string;
}

const initialState: authenticationSliceProps = {
	userID: undefined,
	userData: undefined,
};

const authenticationSlice = createSlice({
	name: "authenticationSlice",
	initialState: initialState,
	reducers: {
		setUserID(state, action: PayloadAction<string | undefined>) {
			state.userID = action.payload;
			if (!action.payload) {
				state.userData = undefined;
			}
		},
		setUserData(state, action: PayloadAction<string>) {
			state.userData = action.payload;
		},
	},
});

export const authenticationActions = authenticationSlice.actions;
export const authenticationReducer = authenticationSlice.reducer;
