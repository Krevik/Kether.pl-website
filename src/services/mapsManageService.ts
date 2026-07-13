import { apiFetch } from '../utils/apiClient';
import { handleAuthError } from '../utils/authUtils';
import { API_DOMAIN } from '../utils/envUtils';
import { apiPaths } from '../utils/apiPaths';

export type MapSourceKind = 'workshop' | 'sirplease' | 'l4d2center' | 'other';

export interface MapManageDetail {
    id: number;
    name: string;
    installedPath: string;
    sourceKind: MapSourceKind;
    workshopId?: number;
    installedAt: string;
    workshopUpdatedAt?: string;
    version?: string;
    checksum?: string;
    checksumKind?: string;
}

export type UpdateCheckStatus = 'updated' | 'up_to_date' | 'unsupported' | 'failed';

export interface UpdateCheckResult {
    status: UpdateCheckStatus;
    message: string;
    map?: MapManageDetail;
}

interface BackendMapDetail {
    id: number;
    name: string;
    installed_path: string;
    source_kind: MapSourceKind;
    workshop_id?: number;
    installed_at: string;
    workshop_updated_at?: string;
    version?: string;
    checksum?: string;
    checksum_kind?: string;
}

interface BackendUpdateCheckResult {
    status: UpdateCheckStatus;
    message: string;
    map?: BackendMapDetail;
}

function mapDetail(detail: BackendMapDetail): MapManageDetail {
    return {
        id: detail.id,
        name: detail.name,
        installedPath: detail.installed_path,
        sourceKind: detail.source_kind,
        workshopId: detail.workshop_id,
        installedAt: detail.installed_at,
        workshopUpdatedAt: detail.workshop_updated_at,
        version: detail.version,
        checksum: detail.checksum,
        checksumKind: detail.checksum_kind,
    };
}

async function authenticatedRequest(path: string, method: 'GET' | 'POST'): Promise<Response> {
    const response = await apiFetch(`${API_DOMAIN}${apiPaths.API_BASE_PATH}${path}`, {
        method,
        auth: true,
    });

    if (handleAuthError(response)) {
        throw new Error('Authentication required');
    }
    return response;
}

async function errorMessage(response: Response): Promise<string> {
    try {
        const body = (await response.json()) as { error?: string };
        return body.error || `HTTP error! status: ${response.status}`;
    } catch {
        return `HTTP error! status: ${response.status}`;
    }
}

export async function fetchMapDetail(id: number): Promise<MapManageDetail> {
    const response = await authenticatedRequest(apiPaths.MAPS_ADMIN_DETAIL(id), 'GET');
    if (!response.ok) {
        throw new Error(await errorMessage(response));
    }
    return mapDetail((await response.json()) as BackendMapDetail);
}

export async function uninstallMap(id: number): Promise<void> {
    const response = await authenticatedRequest(apiPaths.MAPS_ADMIN_UNINSTALL(id), 'POST');
    if (!response.ok) {
        throw new Error(await errorMessage(response));
    }
}

export async function checkMapUpdate(id: number): Promise<UpdateCheckResult> {
    const response = await authenticatedRequest(apiPaths.MAPS_ADMIN_CHECK_UPDATE(id), 'POST');
    if (!response.ok) {
        throw new Error(await errorMessage(response));
    }

    const body = (await response.json()) as BackendUpdateCheckResult;
    return {
        status: body.status,
        message: body.message,
        map: body.map ? mapDetail(body.map) : undefined,
    };
}
