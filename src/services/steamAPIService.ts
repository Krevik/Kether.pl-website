import { useEffect } from 'react';
import { AppState, appStore } from '../redux/store';
import {
    SteamUserDetails,
    userDataActions,
} from '../redux/slices/userDataSlice';
import { useSelector } from 'react-redux';
import adminsFileLoc from '../resources/admins/admins.json';
import { Admin } from '../models/adminModels';
import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';
import { notificationManager } from '../utils/notificationManager';

export const steamAPIService = {
    useAdminDetectionService: () => {
        const userData = useSelector(
            (state: AppState) => state.userDataReducer.userData
        );
        useEffect(() => {
            const admins: Admin[] = [];
            adminsFileLoc.forEach((readCommand: Admin) => {
                admins.push(readCommand);
            });

            let verifiedAsAdmin = false;
            for (let x = 0; x < admins.length; x++) {
                const adminEntry: Admin = admins[x];
                if (adminEntry.steamID === userData?.steamid) {
                    verifiedAsAdmin = true;
                    break;
                }
            }
            appStore.dispatch(userDataActions.setIsAdmin(verifiedAsAdmin));
        }, [userData]);
    },
    useSteamAuthService: () => {
        useEffect(() => {
                if (window.location.href.includes('openid')) {
                    const search = window.location.search.substring(1);

                    const urlObj = JSON.parse(
                        '{"' +
                            decodeURI(search)
                                .replace(/"/g, '\\"')
                                .replace(/&/g, '","')
                                .replace(/=/g, '":"') +
                            '"}'
                    );
                    const getUserId = (response: Record<string, string>) => {
                        const str = response['openid.claimed_id'];
                        const res = decodeURIComponent(str);
                        const propsArr = res.split('/');

                        return propsArr[propsArr.length - 1];
                    };

                    const userId = getUserId(urlObj);
                    userId &&
                        appStore?.dispatch(userDataActions.setUserID(userId));
                    window.location.href = '/';
                }
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
                fetch(
                    `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/games`,
                    {
                        method: 'post',
                        body: userID, // Changed here: send only the userID
                        headers: {
                            'Content-Type': 'application/json' // Added header to indicate plain text
                        }
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
            const response = await fetch(
                `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/userData`,
                {
                    method: 'post',
                    body: userID, // Changed here: send only the userID
                    headers: {
                        'Content-Type': 'application/json' // Added header to indicate plain text
                    }
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
