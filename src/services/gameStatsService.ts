import { useEffect } from 'react';
import { gameStatsActions } from '../redux/slices/gameStatsSlice';
import { appStore } from '../redux/store';
import { API_PATHS, apiPaths } from '../utils/apiPaths';
import {
    GameStatEntry,
    GameStatLazyLoadingParams,
} from '../models/gameStatsModels';
import { API_DOMAIN } from '../utils/envUtils';

const REFRESH_INTERVAL_MS = 30000;

export const gameStatsService = {
    useGameStatsLoadingService: (
        lazyParams: GameStatLazyLoadingParams,
        setLoading: (isLoading: boolean) => void
    ) => {
        const loadStats = () => {
            if (lazyParams) {
                getStats(lazyParams).then((gameStats: GameStatEntry[]) => {
                    if (gameStats) {
                        appStore.dispatch(
                            gameStatsActions.setGameStats(gameStats)
                        );
                        setLoading(false);
                    }
                });
            }
        };

        const loadTotalRecords = () => {
            if (lazyParams) {
                getTotalRecords(lazyParams).then((response) => {
                    if (response.TOTAL_RECORDS) {
                        appStore.dispatch(
                            gameStatsActions.setTotalRecords(
                                response.TOTAL_RECORDS
                            )
                        );
                    }
                });
            }
        };

        useEffect(() => {
            setLoading(true);
            loadTotalRecords();
            loadStats();
            const refreshInterval = setInterval(() => {
                loadStats();
            }, REFRESH_INTERVAL_MS);
            return () => {
                clearInterval(refreshInterval);
            };
        }, [lazyParams]);
    },
};

const getStats = (
    lazyParams: GameStatLazyLoadingParams
): Promise<GameStatEntry[]> => {
    return fetch(
        `${API_PATHS.STATS.GET_PARTIAL}?first=${lazyParams.first}&pageSize=${lazyParams.rows}&page=${lazyParams.page}&sortField=${lazyParams.sortField}&sortOrder=${lazyParams.sortOrder}&query=${lazyParams.query}`,
        {
            method: 'get',
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
        `${API_PATHS.STATS.GET_TOTAL_RECORDS}?first=${lazyParams.first}&rows=${lazyParams.rows}&page=${lazyParams.page}&sortField=${lazyParams.sortField}&sortOrder=${lazyParams.sortOrder}&query=${lazyParams.query}`,
        {
            method: 'get',
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
