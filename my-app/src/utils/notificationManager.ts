import { RefObject } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';

export const notificationManager = {
    SUCCESS: (toast: RefObject<Toast>, message: string) => {
        return showToastNotification(toast, 'success', 'Successful', message);
    },
    ERROR: (toast: RefObject<Toast>, message: string) => {
        return showToastNotification(toast, 'error', 'Failed', message);
    },
};

const showToastNotification = (
    toast: RefObject<Toast>,
    severity: ToastMessage['severity'],
    summary: ToastMessage['summary'],
    detail: string,
    life?: number
) => {
    toast.current!.show({
        severity: severity,
        summary: summary,
        detail: detail,
        life: life || 3000,
    });
};
