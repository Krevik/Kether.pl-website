import { getAccessToken, clearAccessToken } from './authToken';

export interface ApiFetchOptions extends RequestInit {
    /** Attach Authorization: Bearer when a token is stored (default: false). */
    auth?: boolean;
}

export async function apiFetch(
    url: string,
    options: ApiFetchOptions = {}
): Promise<Response> {
    const { auth = false, headers: initHeaders, ...rest } = options;
    const headers = new Headers(initHeaders);

    if (auth) {
        const token = getAccessToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(url, { ...rest, headers });

    if (auth && response.status === 401) {
        clearAccessToken();
    }

    return response;
}
