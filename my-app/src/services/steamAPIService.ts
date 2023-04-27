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
import { networkingUtils } from '../utils/networkingUtils';

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
            setTimeout(() => {
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
                    const getUserId = (response) => {
                        const str = response['openid.claimed_id'];
                        const res = decodeURIComponent(str);
                        const propsArr = res.split('/');
                        return propsArr[propsArr.length - 1];
                    };

                    const userId = getUserId(urlObj);
                    userId &&
                        appStore.dispatch(userDataActions.setUserID(userId));
                    window.location.href = '/';
                }
            }, 500);
        }, []);
    },
    useUserDataFetcher: () => {
        const userID = useSelector(
            (state: AppState) => state.userDataReducer.userID
        );

        useEffect(() => {
            if (userID) {
                steamAPIService.getUserData(userID).then((userData) => {
                    appStore.dispatch(userDataActions.setUserData(userData));
                });
            }
        }, [userID]);
    },
    useOwnedGamesFetcher: () => {
        const userID = useSelector(
            (state: AppState) => state.userDataReducer.userID
        );

        // useEffect(() => {
        //     if (userID) {
        //         fetch(
        //             `${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/games`,
        //             {
        //                 method: 'post',
        //                 body: new URLSearchParams({
        //                     userID: `${userID}`,
        //                 }),
        //             }
        //         )
        //             .then((response) => {
        //                 return response.json();
        //             })
        //             .then((response) => {
        //                 if (response.ownsLeft4Dead2 === true) {
        //                     userDataActions.setGamesData({
        //                         ownsLeft4Dead2: true,
        //                     });
        //                 }
        //             });
        //     }
        // }, []);
    },
    getUserData: (userID: string): Promise<SteamUserDetails> => {
        const fetchUrl = `${apiPaths.DOMAIN_LOCAL_API}/steamService/GetUserData/${userID}`;
        return networkingUtils
            .doFetch<{ response: { players: SteamUserDetails[] } }>(
                fetchUrl,
                'get'
            )
            .then((response) => {
                return response.data!.response.players[0];
            });
    },
};
