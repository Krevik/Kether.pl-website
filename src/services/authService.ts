import { API_PATHS } from '../utils/apiPaths';
import { errorLogger } from '../utils/errorLogger';
import { ErrorType } from '../utils/errorUtils';

export interface SessionResponse {
    steamid: string;
    is_admin: boolean;
}

export const authService = {
    /**
     * Fetch the current session from the backend (HttpOnly cookie).
     * Returns null when not authenticated.
     */
    getSession: async (): Promise<SessionResponse | null> => {
        try {
            const response = await fetch(API_PATHS.AUTH_ME, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 401) {
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return (await response.json()) as SessionResponse;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errorLogger.logError(
                new Error(`Session fetch failed: ${errorMessage}`),
                {
                    component: 'AuthService',
                    action: 'get_session',
                },
                ErrorType.SERVER
            );
            return null;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await fetch(API_PATHS.AUTH_LOGOUT, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errorLogger.logError(
                new Error(`Logout failed: ${errorMessage}`),
                {
                    component: 'AuthService',
                    action: 'logout',
                },
                ErrorType.SERVER
            );
        }
    },
};
