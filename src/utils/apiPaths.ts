import { API_DOMAIN } from './envUtils';

export const apiPaths = {
    API_BASE_PATH: `/api`,
    BINDS_PATH: `/binds`,
    BIND_VOTES_PATH: `/bind_votings`,
    BIND_SUGGESTIONS_PATH: `/bind_suggestions`,
    STEAM_PATH: `/steam`,
    LIVE_SERVER_PATH: `/LiveServerInfo`,
    MAPS_PATH: `/maps`,
    MAPS_ADMIN_INSTALL: `/maps/admin/install`,
    MAPS_ADMIN_DETAIL: (id: number) => `/maps/admin/${id}`,
    MAPS_ADMIN_UNINSTALL: (id: number) => `/maps/admin/${id}/uninstall`,
    MAPS_ADMIN_CHECK_UPDATE: (id: number) => `/maps/admin/${id}/check-update`,
    AUTH_BASE_PATH: `/auth`,
};

export const API_PATHS = {
    SERVER_INFO: `${API_DOMAIN}/api/LiveServerInfo/kether`,
    SERVER_INFO_SECONDARY: `${API_DOMAIN}/api/LiveServerInfo/kether2`,
    SERVER_INFO_ANY: `${API_DOMAIN}/api/LiveServerInfo`, // put IP and port after slash. Example: /api/LiveServerInfo/54.36.179.182/27015
    COMMANDS: `${API_DOMAIN}/api/commands`,
    AUTH_CALLBACK: `${API_DOMAIN}/api/auth/steam/callback`,
    AUTH_EXCHANGE: `${API_DOMAIN}/api/auth/exchange`,
    AUTH_ME: `${API_DOMAIN}/api/auth/me`,
    AUTH_LOGOUT: `${API_DOMAIN}/api/auth/logout`,
    MAPS: `${API_DOMAIN}/api/maps`,
};
