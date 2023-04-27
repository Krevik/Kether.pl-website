import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userDataReducer } from './slices/userDataSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { bindsReducer } from './slices/bindsSlice';
import { bindSuggestionsReducer } from './slices/bindSuggestionsSlice';
import { gameStatsReducer } from './slices/gameStatsSlice';
import { serverInfoReducer } from './slices/serverInfoSlice';
import { bindVotesReducer } from './slices/bindVotesSlice';

const persistConfig = {
    key: 'root',
    storage,
};
const persistedUserDataReducer = persistReducer(persistConfig, userDataReducer);

const combinedReducers = combineReducers({
    userDataReducer: persistedUserDataReducer,
    bindsReducer: bindsReducer,
    bindSuggestionsReducer: bindSuggestionsReducer,
    gameStatsReducer: gameStatsReducer,
    serverInfoReducer: serverInfoReducer,
    bindVotesReducer: bindVotesReducer,
});

export const appStore = configureStore({
    reducer: combinedReducers,
});

export const persistedAppStore = persistStore(appStore);

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
