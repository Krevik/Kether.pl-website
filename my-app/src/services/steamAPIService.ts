import { useEffect } from "react";
import { AppState, appStore } from "../redux/store";
import { authenticationActions } from "../redux/slices/authenticationSlice";
import { useSelector } from "react-redux";
import adminsFileLoc from "../resources/admins/admins.json";
import { Admin } from "../models/adminModels";

export const steamAPIService = {
	useAdminDetectionService: () => {
		const userData = useSelector(
			(state: AppState) => state.authenticationReducer.userData
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
			appStore.dispatch(authenticationActions.setIsAdmin(verifiedAsAdmin));
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
				userId && appStore.dispatch(authenticationActions.setUserID(userId));
				window.location.href = "/";
			}
		}, []);
	},
	useUserDataFetcher: () => {
		const userID = useSelector(
			(state: AppState) => state.authenticationReducer.userID
		);

		useEffect(() => {
			if (userID) {
				fetch("api/steamUserData", {
					method: "post",
					headers: {
						"Content-Security-Policy": "upgrade-insecure-requests",
					},
					body: new URLSearchParams({
						userID: `${userID}`,
					}),
				})
					.then((response) => {
						return response.json();
					})
					.then((response) => {
						appStore.dispatch(
							authenticationActions.setUserData(response.response.players[0])
						);
					});
			}
		}, [userID]);
	},
};
