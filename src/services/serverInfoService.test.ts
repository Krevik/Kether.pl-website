import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPrimaryServerInfo } from './serverInfoService';
import { API_PATHS } from '../utils/apiPaths';

vi.mock('../utils/errorLogger', () => ({ default: { logErrorWithRetry: vi.fn(), logError: vi.fn() } }));

beforeEach(() => {
    vi.stubGlobal('window', { location: { href: 'https://kether.pl/admin' } });
    vi.stubGlobal('navigator', { userAgent: 'test' });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

function snapshot() {
    return { name: 'Kether.pl', map: 'c1m1_hotel', players: 3, maxplayers: 16, bots: 0,
        playerdetails: ['ProPlayer1', 'Noob2', 'Noob3'].map((name) => ({ name, score: 0, duration: 60 })) };
}

describe('fresh primary server player status', () => {
    it('uses the HomePage primary backend endpoint and preserves players and nicknames', async () => {
        const response = snapshot();
        const fetchMock = vi.fn().mockResolvedValue(Response.json(response));
        vi.stubGlobal('fetch', fetchMock);
        await expect(fetchPrimaryServerInfo()).resolves.toEqual({ ...response, status: '1' });
        expect(fetchMock).toHaveBeenCalledExactlyOnceWith(API_PATHS.SERVER_INFO, { signal: expect.any(AbortSignal) });
    });

    it('accepts an empty server without inventing player names', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ...snapshot(), players: '0', maxplayers: '16', playerdetails: [] })));
        await expect(fetchPrimaryServerInfo()).resolves.toMatchObject({ players: '0', maxplayers: '16', playerdetails: [] });
    });

    it.each([{}, { ...snapshot(), players: null }, { ...snapshot(), players: '' },
        { ...snapshot(), players: -1 }, { ...snapshot(), playerdetails: [{}] }])('rejects unavailable or malformed player status', async (response) => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(response)));
        await expect(fetchPrimaryServerInfo()).rejects.toThrow('unavailable');
    });

    it('reports HTTP failures instead of returning a zero-player fallback', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })));
        await expect(fetchPrimaryServerInfo()).rejects.toThrow('HTTP error');
    });

    it('reports backend game-query failures after the existing retry policy', async () => {
        vi.useFakeTimers();
        vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => Response.json({ error: "Couldn't query game server" })));
        const assertion = expect(fetchPrimaryServerInfo()).rejects.toThrow('query timeout');
        await vi.runAllTimersAsync();
        await assertion;
    });
});
