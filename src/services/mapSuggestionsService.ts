import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';
import { handleAuthError } from '../utils/authUtils';
import { apiFetch } from '../utils/apiClient';

export type MapSuggestionSourceKind = 'workshop' | 'l4d2center';

export type MapSuggestionConflict = {
    kind: 'other_source' | string;
    installed_map_id: number;
    installed_name: string;
    installed_source: string;
};

export type MapSuggestion = {
    id: number;
    source_kind: MapSuggestionSourceKind;
    workshop_id?: number;
    l4d2center_name?: string;
    title: string;
    preview_url?: string;
    download_link?: string;
    size_bytes?: number;
    proposed_by: string;
    proposed_at: string;
    conflict?: MapSuggestionConflict;
};

export type CreateMapSuggestionPayload = {
    mode: MapSuggestionSourceKind;
    input: string;
};

export type AcceptMapSuggestionResponse = {
    map_id: number;
};

function suggestionsUrl(path = ''): string {
    return `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.MAPS_SUGGESTIONS_PATH}${path}`;
}

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const body = (await response.json()) as { error?: string };
        if (body.error) {
            return body.error;
        }
    } catch {
        // ignore parse errors
    }
    return `HTTP error! status: ${response.status}`;
}

export async function fetchMapSuggestions(): Promise<MapSuggestion[]> {
    const response = await fetch(suggestionsUrl(), {
        method: 'GET',
        credentials: 'omit',
    });
    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
    return (await response.json()) as MapSuggestion[];
}

export async function createMapSuggestion(
    payload: CreateMapSuggestionPayload
): Promise<MapSuggestion> {
    const response = await apiFetch(suggestionsUrl(), {
        method: 'POST',
        auth: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (handleAuthError(response)) {
        throw new Error('Authentication required');
    }
    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
    return (await response.json()) as MapSuggestion;
}

export async function denyMapSuggestion(id: number): Promise<void> {
    const response = await apiFetch(
        `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.MAPS_SUGGESTION_DENY(id)}`,
        { method: 'POST', auth: true }
    );

    if (handleAuthError(response)) {
        throw new Error('Authentication required');
    }
    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
}

export async function acceptMapSuggestion(
    id: number
): Promise<AcceptMapSuggestionResponse> {
    const response = await apiFetch(
        `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.MAPS_SUGGESTION_ACCEPT(id)}`,
        { method: 'POST', auth: true }
    );

    if (handleAuthError(response)) {
        throw new Error('Authentication required');
    }
    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }
    return (await response.json()) as AcceptMapSuggestionResponse;
}
