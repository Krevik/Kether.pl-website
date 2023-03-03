import { useEffect } from "react";
import { BindEntry, BindVotingEntry } from "../models/bindsModels";
import { AppState, appStore } from "../redux/store";
import { bindsActions } from "../redux/slices/bindsSlice";
import { useSelector } from "react-redux";

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
	reloadBinds: () => {
		fetch("https://kether-api.click/api/binds/getBinds", {
			method: "get",
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
			})
			.then((response) => {
				appStore.dispatch(bindsActions.setBinds(response));
			});
	},
	addNewBind: (bind: BindEntry) => {
		return fetch("https://kether-api.click/api/binds/addBind", {
			method: "post",
			body: new URLSearchParams({
				author: bind.author,
				text: bind.text,
			}),
		}).then(async (response) => {
			if (response.ok) {
				bindsManagingService.reloadBinds();
				return response.json();
			} else {
				throw new Error("Couldn't add the bind");
			}
		});
	},
	deleteBind: (bind: BindEntry) => {
		return fetch("https://kether-api.click/api/binds/deleteBind", {
			method: "post",
			body: new URLSearchParams({
				id: `${bind.id}`,
			}),
		})
			.then((response) => {
				if (response.ok) {
					response.json().then((jsonedResponse) => {
						bindsManagingService.reloadBinds();
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
		return fetch("https://kether-api.click/api/binds/updateBind", {
			method: "post",
			body: new URLSearchParams({
				id: `${newBindData.id}`,
				author: `${newBindData.author}`,
				text: `${newBindData.text}`,
			}),
		})
			.then((response) => {
				if (response.ok) {
					response.json().then((jsonedResponse) => {
						bindsManagingService.reloadBinds();
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
		bindsManagingService.reloadBinds();
	}, []);
};
