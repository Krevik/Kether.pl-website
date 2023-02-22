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
	isAdmin: boolean;
	userData?: SteamUserDetails;
}

const initialState: authenticationSliceProps = {
	userID: undefined,
	isAdmin: false,
	userData: undefined,
};

const authenticationSlice = createSlice({
	name: "authenticationSlice",
	initialState: initialState,
	reducers: {
		setIsAdmin(state, action: PayloadAction<boolean>) {
			state.isAdmin = action.payload;
		},
		setUserID(state, action: PayloadAction<string | undefined>) {
			state.userID = action.payload;
			if (!action.payload) {
				state.userData = undefined;
				state.isAdmin = false;
			}
		},
		setUserData(state, action: PayloadAction<SteamUserDetails>) {
			state.userData = action.payload;
		},
	},
});

export const authenticationActions = authenticationSlice.actions;
export const authenticationReducer = authenticationSlice.reducer;
