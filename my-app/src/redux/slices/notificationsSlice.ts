import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommandEntry } from '../../models/commandModels';
import { ToastMessage } from 'primereact/toast';

export type Notification = {
    type: ToastMessage['severity'];
    title: ToastMessage['summary'];
    message: string;
};

interface notificationsSliceProps {
    notification?: Notification;
}

const initialState: notificationsSliceProps = {
    notification: undefined,
};

const notificationsSlice = createSlice({
    name: 'notificationsSlice',
    initialState: initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Notification>) {
            state.notification = action.payload;
        },
        clearNotification(state) {
            state.notification = undefined;
        },
    },
});

export const notificationsActions = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
