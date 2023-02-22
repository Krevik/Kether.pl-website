import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SteamUserDetails = {
	personaname: string;
	profileurl: string;
	avatar: string;
	avatarmedium: string;
	avatarfull: string;
	realname: string;
	loccountrycode: string;
	steamid: string;
};

interface authenticationSliceProps {
	userID?: string;
	userData?: SteamUserDetails;
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
		setUserData(state, action: PayloadAction<SteamUserDetails>) {
			state.userData = action.payload;
		},
	},
});

export const authenticationActions = authenticationSlice.actions;
export const authenticationReducer = authenticationSlice.reducer;
