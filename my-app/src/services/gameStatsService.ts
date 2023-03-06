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
import { SteamUserDetails } from "../redux/slices/userDataSlice";

const GAME_STATS_REFRESH_TIME_MS = 15000;

export const gameStatsService = {
	useGameStatsLoadingService: () => {
		const gameStats = useSelector(
			(state: AppState) => state.gameStatsReducer.gameStats
		);

		useEffect(() => {
			getStats().then((gameStats) => {
				appStore.dispatch(gameStatsActions.setGameStats(gameStats));
			});
			setInterval(() => {
				getStats().then((gameStats) => {
					appStore.dispatch(gameStatsActions.setGameStats(gameStats));
				});
			}, GAME_STATS_REFRESH_TIME_MS);
		}, []);

		useEffect(() => {
			console.log("Game Stats were updated");
			const detailedGameStats: DetailedGameStatEntry[] = [];

			gameStats.forEach((gameStat: GameStatEntry) => {
				steamAPIService
					.getUserData(gameStat.SteamID)
					.then((userData: SteamUserDetails) => {
						const detailedGameStat: DetailedGameStatEntry = {
							...gameStat,
							userData: userData,
						};
						detailedGameStats.push(detailedGameStat);
						appStore.dispatch(
							gameStatsActions.setDetailedGameStats(detailedGameStats)
						);
					});
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
