import { useEffect } from "react";
import { AppState, appStore } from "../redux/store";
import { userDataActions } from "../redux/slices/userDataSlice";
import { useSelector } from "react-redux";
import adminsFileLoc from "../resources/admins/admins.json";
import { Admin } from "../models/adminModels";

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
		}, []);
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
				fetch("https://kether-api.click/api/steamUserData", {
					method: "post",
					body: new URLSearchParams({
						userID: `${userID}`,
					}),
				})
					.then((response) => {
						return response.json();
					})
					.then((response) => {
						appStore.dispatch(
							userDataActions.setUserData(response.response.players[0])
						);
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
				fetch("https://kether-api.click/api/steam/games", {
					method: "post",
					body: new URLSearchParams({
						userID: `${userID}`,
					}),
				})
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
								console.log(
									"L4D2 game info was found for the current logged user."
								);
								break;
							}
						}
					});
			}
		}, []);
	},
};
