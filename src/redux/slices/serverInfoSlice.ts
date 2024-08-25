import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServerInfo, SteamServerInfo } from '../../models/serverInfoModels';

interface serverInfoSliceProps {
	serverInfo?: ServerInfo;
	steamServerInfo?: SteamServerInfo;
}

const initialState: serverInfoSliceProps = {
	serverInfo: undefined,
	steamServerInfo: undefined,
};

const serverInfoSlice = createSlice({
	name: "serverInfoSlice",
	initialState: initialState,
	reducers: {
		setServerInfo(state, action: PayloadAction<ServerInfo>) {
			state.serverInfo = action.payload;
		},
		setSteamServerInfo(state, action: PayloadAction<SteamServerInfo>){
			state.steamServerInfo = action.payload;
		}
	},
});

export const serverInfoActions = serverInfoSlice.actions;
export const serverInfoReducer = serverInfoSlice.reducer;
