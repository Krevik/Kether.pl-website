import { appStore } from '../redux/store';
import { userDataActions } from '../redux/slices/userDataSlice';
import { notificationManager } from './notificationManager';
import { clearAccessToken } from './authToken';

/**
 * Handle HTTP 401/403 from authenticated API calls.
 * Returns true when the response was an auth error (caller should stop processing).
 */
export function handleAuthError(response: Response): boolean {
    if (response.status === 401) {
        clearAccessToken();
        notificationManager.ERROR('Please log in to continue.');
        appStore.dispatch(userDataActions.setUserID(undefined));
        appStore.dispatch(userDataActions.setIsAdmin(false));
        return true;
    }
    if (response.status === 403) {
        notificationManager.ERROR('You do not have permission to perform this action.');
        appStore.dispatch(userDataActions.setIsAdmin(false));
        return true;
    }
    return false;
}
