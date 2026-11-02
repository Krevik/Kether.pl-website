import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../utils/apiClient';
import { AdminApiError, restartBackend, restartDaemon, softRestartBackend, softRestartDaemon } from './adminPanelService';

vi.mock('../utils/apiClient', () => ({ apiFetch: vi.fn() }));
vi.mock('../utils/authUtils', () => ({ handleAuthError: () => false }));

beforeEach(() => vi.resetAllMocks());

describe('daemon restart requests', () => {
    it.each([false, true])('routes both restart modes separately with force=%s', async (force) => {
        const accepted = { requested_at: '2026-11-02T10:00:00Z' };
        vi.mocked(apiFetch).mockImplementation(async () => Response.json(accepted));

        await expect(restartDaemon(force)).resolves.toEqual(accepted);
        expect(apiFetch).toHaveBeenLastCalledWith(
            expect.stringContaining(`/api/admin/restart/daemon?force=${force}`),
            { method: 'POST', auth: true }
        );
        await expect(softRestartDaemon(force)).resolves.toEqual(accepted);
        expect(apiFetch).toHaveBeenLastCalledWith(
            expect.stringContaining(`/api/admin/soft-restart/daemon?force=${force}`),
            { method: 'POST', auth: true }
        );
    });

    it.each([restartDaemon, softRestartDaemon])('preserves busy errors for %s', async (restart) => {
        vi.mocked(apiFetch).mockResolvedValue(Response.json({ error: 'Daemon is busy' }, { status: 409 }));
        await expect(restart(false)).rejects.toMatchObject({
            name: 'AdminApiError',
            status: 409,
            message: 'Daemon is busy',
        } satisfies Partial<AdminApiError>);
    });
});

describe('backend restart requests', () => {
    it.each([
        { restart: restartBackend, path: '/api/admin/restart/backend' },
        { restart: softRestartBackend, path: '/api/admin/soft-restart/backend' },
    ])('posts the authenticated request to $path', async ({ restart, path }) => {
        const accepted = { requested_at: '2026-11-02T10:00:00Z' };
        vi.mocked(apiFetch).mockResolvedValue(Response.json(accepted));
        await expect(restart()).resolves.toEqual(accepted);
        expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining(path), {
            method: 'POST',
            auth: true,
        });
    });

    it.each([restartBackend, softRestartBackend])('reports unavailable restarts for %s', async (restart) => {
        vi.mocked(apiFetch).mockResolvedValue(Response.json({ error: 'Restart unavailable' }, { status: 503 }));
        await expect(restart()).rejects.toMatchObject({ status: 503, message: 'Restart unavailable' });
    });
});
