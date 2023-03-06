import { useEffect } from "react";
import { gameStatsActions } from "../redux/slices/gameStatsSlice";
import { AppState, appStore } from "../redux/store";
import { apiPaths } from "../utils/apiPaths";
import { useSelector } from "react-redux";
import { steamAPIService } from "./steamAPIService";
import {
	DetailedGameStatEntry,
	GameStatEntry,
} from "../models/gameStatsModels";

const GAME_STATS_REFRESH_TIME_MS = 15000;

export const gameStatsService = {
	useGameStatsLoadingService: () => {
		useEffect(() => {
			getStats().then((gameStats) => {
				appStore.dispatch(gameStatsActions.setGameStats(gameStats));
			});
		}, []);

		setTimeout(() => {
			getStats().then((gameStats) => {
				appStore.dispatch(gameStatsActions.setGameStats(gameStats));
			});
		}, GAME_STATS_REFRESH_TIME_MS);
	},

	useGameStatsDetailer: () => {
		const gameStats = useSelector(
			(state: AppState) => state.gameStatsReducer.gameStats
		);

		useEffect(() => {
			appStore.dispatch(gameStatsActions.setDetailedGameStats([]));
			const detailedGameStatEntries: DetailedGameStatEntry[] = [];
			Promise.all([
				gameStats.forEach((gameStatEntry) => {
					steamAPIService
						.getUserData(gameStatEntry.SteamID)
						.then((detailedUserData) => {
							const detailedGameStatEntry: DetailedGameStatEntry = {
								...gameStatEntry,
								userData: detailedUserData,
							};
							detailedGameStatEntries.push(detailedGameStatEntry);
						});
				}),
			]).then(() => {
				appStore.dispatch(
					gameStatsActions.setDetailedGameStats(detailedGameStatEntries)
				);
			});
		}, [gameStats]);
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
