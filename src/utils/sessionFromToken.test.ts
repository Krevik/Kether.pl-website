import { describe, expect, it } from 'vitest';
import { hydrateSessionFromToken } from './sessionFromToken';

function buildFixtureToken(payload: Record<string, unknown>): string {
    const encoded = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return `eyJhbGciOiJIUzI1NiJ9.${encoded}.signature`;
}

describe('hydrateSessionFromToken', () => {
    it('parses valid admin session', () => {
        const token = buildFixtureToken({
            sub: '76561198000000000',
            exp: Math.floor(Date.now() / 1000) + 3600,
            adm: true,
        });

        expect(hydrateSessionFromToken(token)).toEqual({
            steamid: '76561198000000000',
            isAdmin: true,
        });
    });

    it('parses non-admin session when adm is false', () => {
        const token = buildFixtureToken({
            sub: '76561198000000001',
            exp: Math.floor(Date.now() / 1000) + 3600,
            adm: false,
        });

        expect(hydrateSessionFromToken(token)).toEqual({
            steamid: '76561198000000001',
            isAdmin: false,
        });
    });

    it('treats missing adm as non-admin', () => {
        const token = buildFixtureToken({
            sub: '76561198000000001',
            exp: Math.floor(Date.now() / 1000) + 3600,
        });

        expect(hydrateSessionFromToken(token)?.isAdmin).toBe(false);
    });

    it('returns null for expired token', () => {
        const token = buildFixtureToken({
            sub: '76561198000000000',
            exp: 1,
            adm: true,
        });

        expect(hydrateSessionFromToken(token)).toBeNull();
    });

    it('returns null for malformed token', () => {
        expect(hydrateSessionFromToken('not-a-jwt')).toBeNull();
    });
});
