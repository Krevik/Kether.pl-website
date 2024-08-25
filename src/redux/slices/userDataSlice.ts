import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getEnvironmentData } from 'worker_threads';

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

export type GamesInfo = {
    ownsLeft4Dead2: boolean;
};

interface userDataSliceProps {
    userID?: string;
    isAdmin: boolean;
    userData?: SteamUserDetails;
    gamesData?: GamesInfo;
}

const initialState: userDataSliceProps = {
    // userID: '76561198007892926',
    // isAdmin: true,
    userID: undefined,
    isAdmin: false,
    userData: undefined,
    gamesData: undefined,
};

const userDataSlice = createSlice({
    name: 'userDataSlice',
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
                state.gamesData = undefined;
            }
        },
        setUserData(state, action: PayloadAction<SteamUserDetails>) {
            state.userData = action.payload;
        },
        setGamesData(state, action: PayloadAction<GamesInfo>) {
            state.gamesData = action.payload;
        },
    },
});

export const userDataActions = userDataSlice.actions;
export const userDataReducer = userDataSlice.reducer;
