export interface ParsedSession {
    steamid: string;
    isAdmin: boolean;
}

interface JwtPayload {
    sub?: number | string;
    exp?: number;
    adm?: boolean;
}

function decodeJwtPayload(token: string): JwtPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }

    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const json = atob(padded);
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

function isExpired(exp: number | undefined): boolean {
    if (exp === undefined) {
        return true;
    }
    return exp <= Math.floor(Date.now() / 1000);
}

function steamIdFromSub(sub: number | string | undefined): string | null {
    if (sub === undefined || sub === null) {
        return null;
    }
    const steamid = typeof sub === 'string' ? sub : String(sub);
    return steamid.length > 0 ? steamid : null;
}

/**
 * Parse session UI hints from a JWT access token (payload only, no signature verify).
 * Returns null when the token is malformed or expired.
 */
export function hydrateSessionFromToken(token: string): ParsedSession | null {
    const payload = decodeJwtPayload(token);
    if (!payload) {
        return null;
    }

    if (isExpired(payload.exp)) {
        return null;
    }

    const steamid = steamIdFromSub(payload.sub);
    if (!steamid) {
        return null;
    }

    return {
        steamid,
        isAdmin: payload.adm === true,
    };
}
