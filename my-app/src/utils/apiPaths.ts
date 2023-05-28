const isDevelopmentMode = false;
export const apiPaths = {
    API_DOMAIN: isDevelopmentMode
        ? `http://localhost:3001`
        : `https://kether-api.click`,
    API_BASE_PATH: `/api`,
    BINDS_PATH: `/binds`,
    BIND_SUGGESTIONS_PATH: `/binds/suggestions`,
    STEAM_PATH: `/steam`,
    LIVE_SERVER_PATH: `/liveserver`,
};

const API_DOMAIN = isDevelopmentMode
    ? `http://localhost:3001`
    : `https://kether-api.click`;
export const API_PATHS = {
    SERVER_INFO_LIVESERVER: `${API_DOMAIN}/api/liveserver/serverInfo`,
    SERVER_INFO_STEAM: `${API_DOMAIN}/api/steam/serverInfo`,
    COMMANDS: `${API_DOMAIN}/api/commands`,
};
