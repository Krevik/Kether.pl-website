import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TabType } from "../../components/navbar/models/TabModels";

interface navbarSliceProps {
	activeTabIndex: TabType;
}

const initialState: navbarSliceProps = {
	activeTabIndex: TabType.HOME,
};

const navbarSlice = createSlice({
	name: "navbarSlice",
	initialState: initialState,
	reducers: {
		setActiveTabIndex(state, action: PayloadAction<TabType>) {
			state.activeTabIndex = action.payload;
		},
	},
});

export const navbarActions = navbarSlice.actions;
export const navbarReducer = navbarSlice.reducer;
