import { useEffect } from "react";
import { AppState, appStore } from "../redux/store";
import { authenticationActions } from "../redux/slices/authenticationSlice";
import { useSelector } from "react-redux";

export const steamAPIService = {
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
				fetch("https://57.128.199.143:3001/api/steamUserData", {
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
							authenticationActions.setUserData(response.players[0])
						);
					});
			}
		}, [userID]);
	},
};
