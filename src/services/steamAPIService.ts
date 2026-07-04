import { useEffect } from 'react';
import { AppState, appStore } from '../redux/store';
import {
    SteamUserDetails,
    userDataActions,
} from '../redux/slices/userDataSlice';
import { useSelector } from 'react-redux';
import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';
import { notificationManager } from '../utils/notificationManager';
import { authService } from './authService';
import { clearAccessToken, getAccessToken } from '../utils/authToken';
import { apiFetch } from '../utils/apiClient';
import { hydrateSessionFromToken } from '../utils/sessionFromToken';

function clearSessionState(): void {
    clearAccessToken();
    appStore.dispatch(userDataActions.setUserID(undefined));
    appStore.dispatch(userDataActions.setIsAdmin(false));
}

function applySessionFromToken(token: string): boolean {
    const session = hydrateSessionFromToken(token);
    if (!session) {
        return false;
    }

    appStore.dispatch(userDataActions.setUserID(session.steamid));
    appStore.dispatch(userDataActions.setIsAdmin(session.isAdmin));
    return true;
}

export const steamAPIService = {
    useSessionHydration: () => {
        useEffect(() => {
            const hydrateSession = async () => {
                const token = getAccessToken();
                if (!token) {
                    clearSessionState();
                    return;
                }

                if (!applySessionFromToken(token)) {
                    clearSessionState();
                    return;
                }

                const isValid = await authService.validateSession();
                if (!isValid) {
                    clearSessionState();
                }
            };

            hydrateSession();
        }, []);
    },
    useUserDataFetcher: () => {
        const userID = useSelector(
            (state: AppState) => state.userDataReducer.userID
        );

        useEffect(() => {
            if (userID) {
                steamAPIService?.getUserData(userID).then((userData) => {
                    appStore?.dispatch(userDataActions?.setUserData(userData));
                });
            }
        }, [userID]);
    },
    useOwnedGamesFetcher: () => {
        const userID = useSelector(
            (state: AppState) => state.userDataReducer.userID
        );

        useEffect(() => {
            if (userID) {
                apiFetch(
                    `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/games`,
                    {
                        method: 'post',
                        auth: true,
                        body: userID,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                    })
                    .then((response) => {
                        if (response?.ownsLeft4Dead2 === true) {
                            appStore.dispatch(userDataActions.setGamesData({
                                ownsLeft4Dead2: true,
                            }));
                        }
                    })
                    .catch((error) => {
                        notificationManager.ERROR(
                            `Error while fetching owned games: ${error.message}`
                        );
                    });
            }
        }, [userID]);
    },
    getUserData: async (userID: string): Promise<SteamUserDetails> => {
        try {
            const response = await apiFetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/userData`,
                {
                    method: 'post',
                    auth: true,
                    body: userID,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            notificationManager.ERROR(
                `Error while fetching user data: ${errorMessage}`
            );
            throw error;
        }
    },
};
