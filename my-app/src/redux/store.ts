import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { navbarReducer } from "./slices/navbarSlice";

const combinedReducers = combineReducers({ navbarReducer: navbarReducer });

export const appStore = configureStore({
	reducer: combinedReducers,
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
