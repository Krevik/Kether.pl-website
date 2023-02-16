import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { navbarReducer } from "./slices/navbarSlice";
import { authenticationReducer } from "./slices/authenticationSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { bindsReducer } from "./slices/bindsSlice";

const persistConfig = {
	key: "root",
	storage,
};
const persistedAuthenticationReducer = persistReducer(
	persistConfig,
	authenticationReducer
);

const combinedReducers = combineReducers({
	navbarReducer: navbarReducer,
	authenticationReducer: persistedAuthenticationReducer,
	bindsReducer: bindsReducer,
});

export const appStore = configureStore({
	reducer: combinedReducers,
});

export const persistedAppStore = persistStore(appStore);

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
