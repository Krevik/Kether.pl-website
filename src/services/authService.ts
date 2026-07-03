import { API_PATHS } from '../utils/apiPaths';
import { apiFetch } from '../utils/apiClient';
import { setAccessToken, clearAccessToken } from '../utils/authToken';
import { handleAuthError } from '../utils/authUtils';
import { errorLogger } from '../utils/errorLogger';
import { ErrorType } from '../utils/errorUtils';

export interface SessionResponse {
    steamid: string;
    is_admin: boolean;
}

export interface ExchangeResponse extends SessionResponse {
    access_token: string;
    expires_in: number;
}

export const authService = {
    /**
     * Exchange a one-time OAuth code for a long-lived access token.
     */
    exchangeCode: async (code: string): Promise<ExchangeResponse | null> => {
        try {
            const response = await apiFetch(API_PATHS.AUTH_EXCHANGE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = (await response.json()) as ExchangeResponse;
            if (!data?.access_token || !data?.steamid) {
                return null;
            }

            setAccessToken(data.access_token);
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            errorLogger.logError(
                new Error(`Auth exchange failed: ${errorMessage}`),
                {
                    component: 'AuthService',
                    action: 'exchange_code',
                },
                ErrorType.SERVER
            );
            return null;
        }
    },

    /**
     * Fetch the current session from the backend using the stored Bearer token.
     * Returns null when not authenticated.
     */
    getSession: async (): Promise<SessionResponse | null> => {
        try {
            const response = await apiFetch(API_PATHS.AUTH_ME, {
                method: 'GET',
                auth: true,
            });

            if (response.status === 401) {
                handleAuthError(response);
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = (await response.json()) as SessionResponse | null;
            if (!data?.steamid) {
                return null;
            }

            return data;
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
        clearAccessToken();
        try {
            await apiFetch(API_PATHS.AUTH_LOGOUT, {
                method: 'POST',
                auth: true,
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
