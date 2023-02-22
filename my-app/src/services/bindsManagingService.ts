import { useEffect } from "react";
import {
	BindEntryMultipleTexts,
	BindEntry,
	BindVotingEntry,
} from "../models/bindsModels";
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

		// const newRawData = JSON.stringify(binds);
		// fs.writeFileSync("../database/items.json", newRaw);
	},
	useBindsLoadingService: () => {
		useEffect(() => {
			const localBinds: BindEntryMultipleTexts[] = [];
			bindsFileLoc.forEach((readCommand: BindEntryMultipleTexts) => {
				localBinds.push(readCommand);
			});

			const finalEntries: BindEntry[] = [];
			localBinds.forEach((localBind) => {
				localBind.texts.forEach((text) => {
					const finalEntry: BindEntry = {
						author: localBind.author,
						text: text,
						bindVotingEntries: [],
					};
					finalEntries.push(finalEntry);
				});
			});
			appStore.dispatch(bindsActions.setBinds(finalEntries));
		}, []);
	},
	addNewBind: (bind: BindEntry) => {},
};
