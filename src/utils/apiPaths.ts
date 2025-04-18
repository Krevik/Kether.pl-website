import { API_DOMAIN } from './envUtils';

export const apiPaths = {
    API_BASE_PATH: `/api`,
    BINDS_PATH: `/binds`,
    BIND_VOTES_PATH: `/bind_votings`,
    BIND_SUGGESTIONS_PATH: `/bind_suggestions`,
    STEAM_PATH: `/steam`,
    LIVE_SERVER_PATH: `/LiveServerInfo`,
};

export const API_PATHS = {
    SERVER_INFO: `${API_DOMAIN}/api/LiveServerInfo/kether`,
    COMMANDS: `${API_DOMAIN}/api/commands`,
    // STATS: {
    //     GET_PARTIAL: `${API_DOMAIN}/api/liveserver/gamestats/partial`,
    //     GET_TOTAL_RECORDS: `${API_DOMAIN}/api/liveserver/gamestats/totalRecords`,
    // },
};
