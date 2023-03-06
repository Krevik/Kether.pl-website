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

		const detailedGameStats = useSelector(
			(state: AppState) => state.gameStatsReducer.gameStatsDetailed
		);

		useEffect(() => {
			if (gameStats) {
				appStore.dispatch(
					gameStatsActions.setDetailedGameStats(
						gameStats as DetailedGameStatEntry[]
					)
				);

				detailedGameStats.forEach((detailedGameStat) => {
					if (!detailedGameStat.userData) {
						steamAPIService
							.getUserData(detailedGameStat.SteamID)
							.then((receivedUserData) => {
								gameStatsActions.setUserDetailsInDetailedGameStat({
									gameStatEntry: detailedGameStat,
									steamUserDetails: receivedUserData,
								});
							});
					}
				});
			}
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
