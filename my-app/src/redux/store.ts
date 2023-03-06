import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { navbarReducer } from "./slices/navbarSlice";
import { userDataReducer } from "./slices/userDataSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { bindsReducer } from "./slices/bindsSlice";
import { bindSuggestionsReducer } from "./slices/bindSuggestionsSlice";
import { gameStatsReducer } from "./slices/gameStatsSlice";

const persistConfig = {
	key: "root",
	storage,
};
const persistedUserDataReducer = persistReducer(persistConfig, userDataReducer);

const combinedReducers = combineReducers({
	navbarReducer: navbarReducer,
	userDataReducer: persistedUserDataReducer,
	bindsReducer: bindsReducer,
	bindSuggestionsReducer: bindSuggestionsReducer,
	gameStatsReducer: gameStatsReducer,
});

export const appStore = configureStore({
	reducer: combinedReducers,
});

export const persistedAppStore = persistStore(appStore);

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
