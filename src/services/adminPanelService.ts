import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';
import { handleAuthError } from '../utils/authUtils';
import { apiFetch } from '../utils/apiClient';

/** Website backend (website-server) status, from `GET /api/admin/status`. */
export interface BackendStatus {
    version: string;
    pid: number;
    process_started_at: string;
    /** Reset by every in-process restart of the REST server + Steam bot. */
    services_started_at: string;
    uptime_secs: number;
    restart_supported: boolean;
    soft_restart_supported: boolean;
}

/** KetherServerDaemon status, as reported by the daemon itself. */
export interface DaemonStatus {
    version: string;
    pid: number;
    started_at: string;
    uptime_secs: number;
    /** What map work is running right now, if any. */
    busy: string | null;
    restart_supported: boolean;
    soft_restart_supported: boolean;
}

export interface DaemonReport {
    configured: boolean;
    reachable: boolean;
    status: DaemonStatus | null;
    error: string | null;
}

export interface AdminStatus {
    backend: BackendStatus;
    daemon: DaemonReport;
}

export interface RestartAccepted {
    requested_at: string;
}

/** Thrown for non-auth HTTP errors; `status` lets callers react (e.g. 409 = daemon busy). */
export class AdminApiError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = 'AdminApiError';
    }
}

function adminUrl(path: string): string {
    return `${API_DOMAIN}${apiPaths.API_BASE_PATH}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
    if (handleAuthError(response)) {
        throw new AdminApiError('Authentication required', response.status);
    }
    let body: unknown = undefined;
    try {
        body = await response.json();
    } catch {
        body = undefined;
    }
    if (!response.ok) {
        const message =
            body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
                ? body.error
                : `HTTP error! status: ${response.status}`;
        throw new AdminApiError(message, response.status);
    }
    return body as T;
}

/**
 * Like {@link fetchAdminStatus} but returns `null` instead of throwing when the backend is
 * unreachable (e.g. while it restarts) — used for polling.
 */
export async function tryFetchAdminStatus(): Promise<AdminStatus | null> {
    try {
        const response = await apiFetch(adminUrl(apiPaths.ADMIN_STATUS), { auth: true });
        if (!response.ok) {
            return null;
        }
        return (await response.json()) as AdminStatus;
    } catch {
        return null;
    }
}

export async function fetchAdminStatus(): Promise<AdminStatus> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_STATUS), { auth: true });
    return readJson<AdminStatus>(response);
}

export async function restartBackend(): Promise<RestartAccepted> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_RESTART_BACKEND), {
        method: 'POST',
        auth: true,
    });
    return readJson<RestartAccepted>(response);
}

/** Restarts the REST server and Steam bot in the existing backend process. */
export async function softRestartBackend(): Promise<RestartAccepted> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_SOFT_RESTART_BACKEND), {
        method: 'POST',
        auth: true,
    });
    return readJson<RestartAccepted>(response);
}

/** Without `force`, the daemon refuses (HTTP 409) while map work is running. */
export async function restartDaemon(force: boolean): Promise<RestartAccepted> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_RESTART_DAEMON(force)), {
        method: 'POST',
        auth: true,
    });
    return readJson<RestartAccepted>(response);
}

/** Re-executes the daemon in place; refuses busy map work unless forced. */
export async function softRestartDaemon(force: boolean): Promise<RestartAccepted> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_SOFT_RESTART_DAEMON(force)), {
        method: 'POST',
        auth: true,
    });
    return readJson<RestartAccepted>(response);
}

/** Active state of the L4D2 game server systemd unit. */
export type GameServerActiveState =
    | 'active'
    | 'inactive'
    | 'activating'
    | 'deactivating'
    | 'failed'
    | 'unknown';

export interface GameServerStatus {
    service: string;
    active_state: GameServerActiveState;
    active_state_raw: string;
    sub_state: string;
    description: string;
    main_pid: number;
    main_comm?: string | null;
    main_started_at?: string | null;
    main_uptime_secs?: number | null;
    srcds_pid?: number | null;
    srcds_comm?: string | null;
    srcds_started_at?: string | null;
    srcds_uptime_secs?: number | null;
}

export interface GameServerActionResult {
    action: string;
    status: GameServerStatus;
}

export async function fetchGameServerStatus(): Promise<GameServerStatus> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_GAME_SERVER_STATUS), { auth: true });
    return readJson<GameServerStatus>(response);
}

export async function gameServerStart(): Promise<GameServerActionResult> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_GAME_SERVER_START), {
        method: 'POST',
        auth: true,
    });
    return readJson<GameServerActionResult>(response);
}

export async function gameServerStop(): Promise<GameServerActionResult> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_GAME_SERVER_STOP), {
        method: 'POST',
        auth: true,
    });
    return readJson<GameServerActionResult>(response);
}

export async function gameServerRestart(): Promise<GameServerActionResult> {
    const response = await apiFetch(adminUrl(apiPaths.ADMIN_GAME_SERVER_RESTART), {
        method: 'POST',
        auth: true,
    });
    return readJson<GameServerActionResult>(response);
}
