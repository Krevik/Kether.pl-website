import { useEffect } from "react";
import { BindEntry, BindVotingEntry } from "../models/bindsModels";
import bindsFileLoc from "../resources/binds/binds.json";
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
		fetch("https://kether-api.click/api/getBinds", {
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
	addNewBind: (bind: BindEntry) => {},
	deleteBind: (bind: BindEntry) => {
		return fetch("https://kether-api.click/api/binds/deleteBind", {
			method: "post",
			body: new URLSearchParams({
				id: `${bind.id}`,
			}),
		});
	},
};

const useServerBindsLoader = () => {
	useEffect(() => {
		bindsManagingService.reloadBinds();
	}, []);
};
