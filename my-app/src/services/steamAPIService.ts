import { useEffect } from "react";
import { AppState, appStore } from "../redux/store";
import {
	SteamUserDetails,
	userDataActions,
} from "../redux/slices/userDataSlice";
import { useSelector } from "react-redux";
import adminsFileLoc from "../resources/admins/admins.json";
import { Admin } from "../models/adminModels";
import { apiPaths } from "../utils/apiPaths";
import UserDetails from "../components/navbar/userDetails/UserDetails";

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
			if (window.location.href.includes("openid")) {
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
					const str = response["openid.claimed_id"];
					const res = decodeURIComponent(str);
					const propsArr = res.split("/");
					console.log(propsArr);

					return propsArr[propsArr.length - 1];
				};

				const userId = getUserId(urlObj);
				userId && appStore.dispatch(userDataActions.setUserID(userId));
				window.location.href = "/";
			}
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

		useEffect(() => {
			if (userID) {
				fetch(
					`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/games`,
					{
						method: "post",
						body: new URLSearchParams({
							userID: `${userID}`,
						}),
					}
				)
					.then((response) => {
						return response.json();
					})
					.then((response) => {
						const games: [
							{ name: string; appid: number; playtime_forever: number }
						] = response.response.games;

						for (let game of games) {
							//L4D2 appid = 550
							if (game.appid === 550) {
								userDataActions.setGamesData({ ownsLeft4Dead2: true });
								break;
							}
						}
					});
			}
		}, []);
	},
	getUserData: (userID: string): Promise<SteamUserDetails> => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.STEAM_PATH}/userData`,
			{
				method: "post",
				body: new URLSearchParams({
					userID: `${userID}`,
				}),
			}
		)
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				return response.response.players[0];
			});
	},
};
