import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userDataReducer } from './slices/userDataSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { bindsReducer } from './slices/bindsSlice';
import { bindSuggestionsReducer } from './slices/bindSuggestionsSlice';
import { serverInfoReducer } from './slices/serverInfoSlice';
import { commandsReducer } from './slices/commandsSlice';
import { notificationsReducer } from './slices/notificationsSlice';
import { uiReducer } from './slices/uiSlice';

const userDataPersistConfig = {
    key: 'userData',
    storage,
};
const uiPersistConfig = {
    key: 'ui',
    storage,
};

const persistedUserDataReducer = persistReducer(userDataPersistConfig, userDataReducer);
const persistedUIReducer = persistReducer(uiPersistConfig, uiReducer);

const combinedReducers = combineReducers({
    userDataReducer: persistedUserDataReducer,
    bindsReducer: bindsReducer,
    commandsReducer: commandsReducer,
    bindSuggestionsReducer: bindSuggestionsReducer,
    serverInfoReducer: serverInfoReducer,
    notificationsReducer: notificationsReducer,
    uiReducer: persistedUIReducer,
});

export const appStore = configureStore({
    reducer: combinedReducers,
});

export const persistedAppStore = persistStore(appStore);

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
