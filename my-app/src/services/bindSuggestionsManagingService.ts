import { useEffect } from "react";
import { BindEntry } from "../models/bindsModels";
import { AppState, appStore } from "../redux/store";
import { bindsActions } from "../redux/slices/bindsSlice";
import { apiPaths } from "../utils/apiPaths";
import { bindSuggestionsActions } from "../redux/slices/bindSuggestionsSlice";
import { useSelector } from "react-redux";

export const bindSuggestionsManagingService = {
	useBindSuggestionsLoadingService: () => {
		useServerBindSuggestionsLoader();
	},
	getBindSuggestions: () => {
		fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/getBinds`,
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
				appStore.dispatch(bindSuggestionsActions.setBindSuggestions(response));
			});
	},
	addNewBindSuggestion: (bind: BindEntry) => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/addBind`,
			{
				method: "post",
				body: new URLSearchParams({
					author: bind.author,
					text: bind.text,
					proposedBy: bind.proposedBy!,
				}),
			}
		).then(async (response) => {
			if (response.ok) {
				bindSuggestionsManagingService.getBindSuggestions();
				return response.json();
			} else {
				throw new Error("Couldn't add the bind suggestion");
			}
		});
	},
	deleteBindSuggestion: (bind: BindEntry) => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/deleteBind`,
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
						bindSuggestionsManagingService.getBindSuggestions();
						return jsonedResponse.message;
					});
				} else {
					throw new Error("Couldn't delete bind suggestion");
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
	},
	updateBindSuggestion: (newBindData: BindEntry) => {
		return fetch(
			`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.BIND_SUGGESTIONS_PATH}/updateBind`,
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
						bindSuggestionsManagingService.getBindSuggestions();
						return jsonedResponse.message;
					});
				} else {
					throw new Error("Couldn't update bind suggestion");
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
	},
};

const useServerBindSuggestionsLoader = () => {
	const isAdmin = useSelector(
		(state: AppState) => state.userDataReducer.isAdmin
	);
	useEffect(() => {
		if (isAdmin) {
			bindSuggestionsManagingService.getBindSuggestions();
		}
	}, []);
};
