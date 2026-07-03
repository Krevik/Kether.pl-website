import { InstallMapPayload } from '../components/InstalledSVMaps/installMapUtils';
import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';
import { handleAuthError } from '../utils/authUtils';

export interface AdminInstallMapResponse {
    map_id: number;
    resolved_mode: string;
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
