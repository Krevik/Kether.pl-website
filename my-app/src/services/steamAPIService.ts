import { useEffect } from "react";
import { AppState, appStore } from "../redux/store";
import { authenticationActions } from "../redux/slices/authenticationSlice";
import { useSelector } from "react-redux";
import axios from "axios";

const STEAM_API_KEY = "F9B6127DDEB6AF27EA0D64F1E5C642A4";

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
				const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${userID}`;
				axios
					.get(fetchURL, {
						headers: {
							Accept: "application/json",
							"Content-Type":
								"application/x-www-form-urlencoded; charset=UTF-8",
						},
					})
					.then((response) => {
						// Website you wish to allow to connect
						//@ts-ignore
						response.setHeader(
							"Access-Control-Allow-Origin",
							"http://api.steampowered.com"
						);
						//@ts-ignore
						// Request methods you wish to allow
						response.setHeader(
							"Access-Control-Allow-Methods",
							"GET, POST, OPTIONS, PUT, PATCH, DELETE"
						);
						//@ts-ignore
						// Request headers you wish to allow
						response.setHeader(
							"Access-Control-Allow-Headers",
							"X-Requested-With,content-type"
						);
						//@ts-ignore
						// Set to true if you need the website to include cookies in the requests sent
						// to the API (e.g. in case you use sessions)
						response.setHeader("Access-Control-Allow-Credentials", true);

						console.log(response);
					});
			}
		}, [userID]);
	},
};
