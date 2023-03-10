import { useEffect } from "react";
import { gameStatsActions } from "../redux/slices/gameStatsSlice";
import { appStore } from "../redux/store";
import { apiPaths } from "../utils/apiPaths";
import {
	GameStatEntry,
	GameStatLazyLoadingParams,
} from "../models/gameStatsModels";

const REFRESH_INTERVAL_MS = 15000;

export const gameStatsService = {
	useGameStatsLoadingService: (lazyParams: GameStatLazyLoadingParams) => {
		const loadStats = () => {
			getStats(lazyParams).then((gameStats) => {
				if (gameStats) {
					appStore.dispatch(gameStatsActions.setGameStats(gameStats));
				}
			});
		};

		const loadTotalRecords = () => {
			getTotalRecords(lazyParams).then((response) => {
				if (response.TOTAL_RECORDS) {
					appStore.dispatch(
						gameStatsActions.setTotalRecords(response.TOTAL_RECORDS)
					);
				}
			});
		};

		useEffect(() => {
			loadTotalRecords();
			loadStats();
			const refreshInterval = setInterval(() => {
				loadStats();
			}, REFRESH_INTERVAL_MS);
			return () => {
				clearInterval(refreshInterval);
			};
		}, []);

		useEffect(() => {
			loadTotalRecords();
			loadStats();
		}, [lazyParams]);
	},
};

const getStats = (
	lazyParams: GameStatLazyLoadingParams
): Promise<GameStatEntry[]> => {
	return fetch(
		`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.LIVE_SERVER_PATH}/gameStats?first=${lazyParams.first}&pageSize=${lazyParams.rows}&page=${lazyParams.page}&sortField=${lazyParams.sortField}&sortOrder=${lazyParams.sortOrder}`,
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

const getTotalRecords = (
	lazyParams: GameStatLazyLoadingParams
): Promise<{ TOTAL_RECORDS: number }> => {
	return fetch(
		`${apiPaths.API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.LIVE_SERVER_PATH}/gameStats/countRecords?first=${lazyParams.first}&rows=${lazyParams.rows}&page=${lazyParams.page}&sortField=${lazyParams.sortField}&sortOrder=${lazyParams.sortOrder}`,
		{
			method: "get",
		}
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
		})
		.then((response: { TOTAL_RECORDS: number }[]) => {
			return response[0];
		});
};
