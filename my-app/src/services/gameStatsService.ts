import { useEffect } from "react";
import { gameStatsActions } from "../redux/slices/gameStatsSlice";
import { AppState, appStore } from "../redux/store";
import { apiPaths } from "../utils/apiPaths";
import { useSelector } from "react-redux";
import { GameStatEntry } from "../models/gameStatsModels";

const REFRESH_INTERVAL_MS = 15000;

export const gameStatsService = {
	useGameStatsLoadingService: () => {
		const gameStats = useSelector(
			(state: AppState) => state.gameStatsReducer.gameStats
		);

		const loadStats = () => {
			getStats().then((gameStats) => {
				appStore.dispatch(gameStatsActions.setGameStats(gameStats));
			});
		};

		useEffect(() => {
			loadStats();
			setInterval(() => {
				loadStats();
			}, REFRESH_INTERVAL_MS);
		}, []);
	},
};

const getStats = (): Promise<GameStatEntry[]> => {
	return fetch(
		`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.LIVE_SERVER_PATH}/gameStats`,
		{
			method: "get",
		}
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
		})
		.then((response: GameStatEntry[]) => {
			return response;
		});
};
