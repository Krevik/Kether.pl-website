import { API_DOMAIN } from './envUtils';

export const apiPaths = {
    API_BASE_PATH: `/api`,
    BINDS_PATH: `/binds`,
    BIND_SUGGESTIONS_PATH: `/binds/suggestions`,
    STEAM_PATH: `/steam`,
    LIVE_SERVER_PATH: `/liveserver`,
};

export const API_PATHS = {
    SERVER_INFO: {},
    SERVER_INFO_LIVESERVER: `${API_DOMAIN}/api/liveserver/serverInfo`,
    SERVER_INFO_STEAM: `${API_DOMAIN}/api/steam/serverInfo`,
    COMMANDS: `${API_DOMAIN}/api/commands`,
    STATS: {
        GET_PARTIAL: `${API_DOMAIN}/api/liveserver/gamestats/partial`,
        GET_TOTAL_RECORDS: `${API_DOMAIN}/api/liveserver/gamestats/totalRecords`,
    },
};
