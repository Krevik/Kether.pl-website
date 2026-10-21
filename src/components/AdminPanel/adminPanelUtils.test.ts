import { describe, expect, it } from 'vitest';
import { formatUptime, hasRestarted, serviceStartedAt } from './adminPanelUtils';
import { AdminStatus } from '../../services/adminPanelService';

function status(backendStarted: string, daemonStarted: string | null): AdminStatus {
    return {
        backend: {
            version: '0.0.1',
            pid: 1,
            process_started_at: '2026-10-20T10:00:00Z',
            services_started_at: backendStarted,
            uptime_secs: 5,
            restart_supported: true,
        },
        daemon: {
            configured: true,
            reachable: daemonStarted !== null,
            status: daemonStarted
                ? {
                      version: '0.0.1',
                      pid: 2,
                      started_at: daemonStarted,
                      uptime_secs: 5,
                      busy: null,
                      restart_supported: true,
                  }
                : null,
            error: daemonStarted ? null : 'Daemon unreachable',
        },
    };
}

describe('adminPanelUtils', () => {
    const requestedAt = new Date('2026-10-21T12:00:00Z');

    it('detects a restart by a changed start time, regardless of clock skew', () => {
        const previous = new Date('2026-10-21T13:00:00Z'); // daemon clock ahead of the backend
        expect(
            hasRestarted(status('x', '2026-10-21T13:00:00Z'), 'daemon', previous, requestedAt)
        ).toBe(false);
        expect(
            hasRestarted(status('x', '2026-10-21T13:00:05Z'), 'daemon', previous, requestedAt)
        ).toBe(true);
    });

    it('falls back to the request time when no previous start time is known', () => {
        expect(hasRestarted(status('2026-10-21T11:59:59Z', null), 'backend', null, requestedAt)).toBe(false);
        expect(hasRestarted(status('2026-10-21T12:00:01Z', null), 'backend', null, requestedAt)).toBe(true);
    });

    it('treats unreachable or missing status as not restarted', () => {
        expect(hasRestarted(null, 'backend', null, requestedAt)).toBe(false);
        expect(hasRestarted(status('2026-10-21T12:00:01Z', null), 'daemon', null, requestedAt)).toBe(false);
        expect(serviceStartedAt(status('not a date', null), 'backend')).toBeNull();
    });

    it('formats uptime compactly', () => {
        expect(formatUptime(42)).toBe('42s');
        expect(formatUptime(7 * 60 + 3)).toBe('7m 3s');
        expect(formatUptime(5 * 3600 + 12 * 60)).toBe('5h 12m');
        expect(formatUptime(3 * 86_400 + 4 * 3600 + 59)).toBe('3d 4h');
        expect(formatUptime(-5)).toBe('0s');
    });
});
