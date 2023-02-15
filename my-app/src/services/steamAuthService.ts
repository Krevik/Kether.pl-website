import { useEffect } from "react";
import { appStore } from "../redux/store";
import { authenticationActions } from "../redux/slices/authenticationSlice";

export const steamAuthService = {
	useSteamAuthService: () => {
		useEffect(() => {
			if (window.location.href.includes("openid")) {
				try {
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
				} catch (error) {
					console.log(
						"Something went wrong during authentication: " +
							JSON.stringify(error)
					);
				}
			}
		}, []);
	},
};
