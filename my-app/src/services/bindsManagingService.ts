import { useEffect } from "react";
import { BindEntry, BindVotingEntry } from "../models/bindsModels";
import { AppState, appStore } from "../redux/store";
import { bindsActions } from "../redux/slices/bindsSlice";
import { useSelector } from "react-redux";
import { apiPaths } from "../utils/apiPaths";

export const bindsManagingService = {
	useBindVotingService: (
		votingEntry: BindVotingEntry,
		votedBind: BindEntry
	) => {
		const binds = useSelector((state: AppState) => state.bindsReducer.binds);
		for (let x = 0; x < binds.length; x++) {
			if (votedBind.text === binds[x].text) {
				binds[x].bindVotingEntries = [
					...binds[x].bindVotingEntries,
					votingEntry,
				];
			}
		}
	},
	useBindsLoadingService: () => {
		useServerBindsLoader();
	},
	getBinds: () => {
		fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/getBinds`,
			{
				method: "get",
			}
		)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
			})
			.then((response: BindEntry[]) => {
				appStore.dispatch(bindsActions.setBinds(response));
			});
	},
	addNewBind: (bind: BindEntry) => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/addBind`,
			{
				method: "post",
				body: new URLSearchParams({
					author: bind.author,
					text: bind.text,
				}),
			}
		).then(async (response) => {
			if (response.ok) {
				bindsManagingService.getBinds();
				return response.json().then((response) => {
					return response;
				});
			} else {
				throw new Error("Couldn't add the bind");
			}
		});
	},
	deleteBind: (bind: BindEntry) => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/deleteBind`,
			{
				method: "post",
				body: new URLSearchParams({
					id: `${bind.id}`,
				}),
			}
		)
			.then((response) => {
				if (response.ok) {
					response.json().then((jsonedResponse) => {
						bindsManagingService.getBinds();
						return jsonedResponse.message;
					});
				} else {
					throw new Error("Couldn't delete bind");
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
	},
	updateBind: (newBindData: BindEntry) => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BINDS_PATH}/updateBind`,
			{
				method: "post",
				body: new URLSearchParams({
					id: `${newBindData.id}`,
					author: `${newBindData.author}`,
					text: `${newBindData.text}`,
				}),
			}
		)
			.then((response) => {
				if (response.ok) {
					response.json().then((jsonedResponse) => {
						bindsManagingService.getBinds();
						return jsonedResponse.message;
					});
				} else {
					throw new Error("Couldn't update bind");
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
	},
};

const useServerBindsLoader = () => {
	useEffect(() => {
		bindsManagingService.getBinds();
	}, []);
};
