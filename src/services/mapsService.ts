import { MapEntry } from '../components/InstalledSVMaps/mapEntry';
import { enrichMapsWithFallbackPreviews } from '../components/InstalledSVMaps/utils';
import { FALLBACK_INSTALLED_MAPS } from '../components/InstalledSVMaps/mapsData.fallback';
import { apiPaths } from '../utils/apiPaths';
import { API_DOMAIN } from '../utils/envUtils';

export type MapsDataSource = 'registry' | 'registry_stale' | 'local_fallback';

export interface InstalledMapsResult {
    maps: MapEntry[];
    stale: boolean;
    source: MapsDataSource;
}

interface MapsApiResponse {
    maps: MapEntry[];
    stale: boolean;
    source: 'registry' | 'registry_stale';
}

function localFallback(): InstalledMapsResult {
    return {
        maps: FALLBACK_INSTALLED_MAPS,
        stale: true,
        source: 'local_fallback',
    };
}

export async function fetchInstalledMaps(): Promise<InstalledMapsResult> {
    try {
        const response = await fetch(
            `${API_DOMAIN}${apiPaths.API_BASE_PATH}${apiPaths.MAPS_PATH}`,
            {
                method: 'GET',
                credentials: 'omit',
            }
        );

        if (!response.ok) {
            return localFallback();
        }

        const body = (await response.json()) as MapsApiResponse;
        const maps = body.maps ?? [];

        if (maps.length === 0) {
            return localFallback();
        }

        return {
            maps: enrichMapsWithFallbackPreviews(maps),
            stale: Boolean(body.stale),
            source: body.source ?? 'registry',
        };
    } catch {
        return localFallback();
    }
}
