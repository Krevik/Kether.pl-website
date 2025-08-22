/**
 * Application constants for better maintainability
 */

// API Configuration
export const API_CONFIG = {
    REFRESH_INTERVAL_MS: 5000,
    DEFAULT_TIMEOUT_MS: 10000,
} as const;

// Server Configuration
export const SERVER_CONFIG = {
    IP: '54.36.179.182:27015',
    STEAM_CONNECT_URL: 'steam://connect/54.36.179.182:27015',
} as const;

// External URLs
export const EXTERNAL_URLS = {
    DISCORD_INVITE: 'https://discord.gg/5Pgqt5fc5N',
    STEAM_CHAT_INVITE: 'https://steamcommunity.com/chat/invite/BHB07D0c',
    GITHUB_REPO: 'https://github.com/Krevik/Kether.pl-L4D2-Server',
} as const;

// UI Constants
export const UI_CONFIG = {
    TOAST_DURATION_MS: 3000,
    MAX_BIND_LENGTH: 1000,
    MAX_COMMAND_LENGTH: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error occurred',
    UNKNOWN_ERROR: 'An unknown error occurred',
    FETCH_FAILED: 'Failed to fetch data',
    SAVE_FAILED: 'Failed to save data',
    DELETE_FAILED: 'Failed to delete data',
    UPDATE_FAILED: 'Failed to update data',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    SAVE_SUCCESS: 'Successfully saved',
    DELETE_SUCCESS: 'Successfully deleted',
    UPDATE_SUCCESS: 'Successfully updated',
    COPY_SUCCESS: 'Copied to clipboard',
} as const;
