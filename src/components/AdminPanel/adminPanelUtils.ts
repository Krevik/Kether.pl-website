import { AdminStatus } from '../../services/adminPanelService';

export type ServiceId = 'backend' | 'daemon';

/** How often to poll while waiting for a service to come back, and for how long. */
export const RESTART_POLL_INTERVAL_MS = 2000;
export const RESTART_TIMEOUT_MS = 90_000;

/** When the service's current instance started, or `null` if unknown/unreachable. */
export function serviceStartedAt(status: AdminStatus | null, service: ServiceId): Date | null {
    if (!status) {
        return null;
    }
    const raw =
        service === 'backend'
            ? status.backend.services_started_at
            : status.daemon.status?.started_at ?? null;
    if (!raw) {
        return null;
    }
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * A restart is complete once the service reports a different instance than before.
 *
 * The start time is compared with the one seen before the restart (`previousStartedAt`)
 * rather than with the request time, because the daemon may run on another machine whose
 * clock differs from the website backend's. Without a previous value, falls back to
 * "started after `requestedAt`".
 */
export function hasRestarted(
    status: AdminStatus | null,
    service: ServiceId,
    previousStartedAt: Date | null,
    requestedAt: Date
): boolean {
    const startedAt = serviceStartedAt(status, service);
    if (startedAt === null) {
        return false;
    }
    if (previousStartedAt !== null) {
        return startedAt.getTime() !== previousStartedAt.getTime();
    }
    return startedAt.getTime() > requestedAt.getTime();
}

/** Compact uptime such as `3d 4h`, `5h 12m`, `7m 3s`. */
export function formatUptime(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const days = Math.floor(seconds / 86_400);
    const hours = Math.floor((seconds % 86_400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (days > 0) {
        return `${days}d ${hours}h`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}
