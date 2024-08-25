import { Toast, ToastMessage } from 'primereact/toast';
import { useSelector } from 'react-redux';
import { AppState, appStore } from '../../redux/store';
import { useCallback, useEffect, useRef } from 'react';
import { notificationsActions } from '../../redux/slices/notificationsSlice';

export const NotificationsOverlay = () => {
    const notificationToShow = useSelector(
        (state: AppState) => state.notificationsReducer.notification
    );
    const notificationsToast = useRef<Toast>(null);

    const getToastMessage = useCallback(() => {
        const toastMessage: ToastMessage = {
            severity: notificationToShow?.type,
            summary: notificationToShow?.title,
            detail: notificationToShow?.message,
        };
        return toastMessage;
    }, [notificationToShow]);

    useEffect(() => {
        if (notificationToShow) {
            notificationsToast.current!.show(getToastMessage());
            appStore.dispatch(notificationsActions.clearNotification());
        }
    }, [notificationToShow]);
    return (
        <>
            <Toast ref={notificationsToast}></Toast>
        </>
    );
};
