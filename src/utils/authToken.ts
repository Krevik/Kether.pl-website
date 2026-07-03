const TOKEN_STORAGE_KEY = 'kether_session_token';

export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}
