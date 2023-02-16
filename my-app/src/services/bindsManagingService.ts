import { useEffect } from "react";
import { BindEntryMultipleTexts, BindEntry } from "../models/bindsModels";
import bindsFileLoc from "../resources/binds/binds.json";
import { appStore } from "../redux/store";
import { bindsActions } from "../redux/slices/bindsSlice";

export const bindsManagingService = {
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
					};
					finalEntries.push(finalEntry);
				});
			});
			appStore.dispatch(bindsActions.setBinds(finalEntries));
		}, []);
	},
};
