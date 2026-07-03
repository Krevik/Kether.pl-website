import { InstallMapPayload } from '../components/InstalledSVMaps/installMapUtils';
import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';
import { handleAuthError } from '../utils/authUtils';

export interface AdminInstallMapResponse {
    map_id: number;
    resolved_mode: string;
}

export interface L4d2CenterCatalogEntry {
    name: string;
    size: number;
    md5: string;
    download_link: string;
    installed: boolean;
    map_id?: number;
    status: string;
}

export async function fetchL4d2CenterCatalog(): Promise<L4d2CenterCatalogEntry[]> {
    const response = await fetch(
        `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.MAPS_L4D2CENTER}`,
        {
            credentials: 'include',
        }
    );

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const body = (await response.json()) as { error?: string };
            if (body.error) {
                errorMessage = body.error;
            }
        } catch {
            // use default message
        }
        throw new Error(errorMessage);
    }

    return (await response.json()) as L4d2CenterCatalogEntry[];
}

export async function installMap(
    payload: InstallMapPayload
): Promise<AdminInstallMapResponse> {
    const response = await fetch(
        `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.MAPS_ADMIN_INSTALL}`,
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }
    );

    if (handleAuthError(response)) {
        throw new Error('Authentication required');
    }

    let body: AdminInstallMapResponse | { error?: string } = {
        map_id: 0,
        resolved_mode: '',
    };

    try {
        body = (await response.json()) as AdminInstallMapResponse | { error?: string };
    } catch {
        body = { error: `HTTP error! status: ${response.status}` };
    }

    if (!response.ok) {
        const errorMessage =
            'error' in body && body.error
                ? body.error
                : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }

    return body as AdminInstallMapResponse;
}
