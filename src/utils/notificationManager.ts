import { appStore } from '../redux/store';
import {
    Notification,
    notificationsActions,
} from '../redux/slices/notificationsSlice';

export const notificationManager = {
    SUCCESS: (message: string) => {
        const notification: Notification = {
            type: 'success',
            title: 'Success',
            message: message,
        };
        appStore.dispatch(notificationsActions.addNotification(notification));
        setTimeout(() => {
            appStore.dispatch(notificationsActions.clearNotification());
        }, 5000);
    },
    ERROR: (message: string) => {
        const notification: Notification = {
            type: 'error',
            title: 'Fail',
            message: message,
        };
        appStore.dispatch(notificationsActions.addNotification(notification));
        setTimeout(() => {
            appStore.dispatch(notificationsActions.clearNotification());
        }, 5000);
    },
};
