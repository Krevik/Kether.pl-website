import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface serverInfoSliceProps {
	serverInfo: any;
}

const initialState: serverInfoSliceProps = {
	serverInfo: undefined,
};

const serverInfoSlice = createSlice({
	name: "serverInfoSlice",
	initialState: initialState,
	reducers: {
		setServerInfo(state, action: PayloadAction<any>) {
			state.serverInfo = action.payload;
		},
	},
});

export const serverInfoActions = serverInfoSlice.actions;
export const serverInfoReducer = serverInfoSlice.reducer;
