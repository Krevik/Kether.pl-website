import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServerInfo } from "../../models/serverInfoModels";

interface serverInfoSliceProps {
	serverInfo?: ServerInfo;
}

const initialState: serverInfoSliceProps = {
	serverInfo: undefined,
};

const serverInfoSlice = createSlice({
	name: "serverInfoSlice",
	initialState: initialState,
	reducers: {
		setServerInfo(state, action: PayloadAction<ServerInfo>) {
			state.serverInfo = action.payload;
		},
	},
});

export const serverInfoActions = serverInfoSlice.actions;
export const serverInfoReducer = serverInfoSlice.reducer;
