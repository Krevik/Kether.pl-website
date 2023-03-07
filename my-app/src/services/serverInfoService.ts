import { useEffect } from "react";
import { apiPaths } from "../utils/apiPaths";
import { appStore } from "../redux/store";
import { serverInfoActions } from "../redux/slices/serverInfoSlice";
import { ServerInfo } from "../models/serverInfoModels";

export const serverInfoService = {
	useServerInfoLoadingService: () => {
		useEffect(() => {
			fetch(`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}/serverInfo`, {
				method: "post",
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Security-Policy": "upgrade-insecure-requests",
				},
			})
				.then((response) => {
					return response.json();
				})
				.then((response: ServerInfo) => {
					appStore.dispatch(serverInfoActions.setServerInfo(response));
				});
		}, []);
	},
};
