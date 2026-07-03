import { MapEntry } from './mapEntry';
import { MAP_SOURCES } from './constants';

export const L4D2CENTER_INDEX_URL =
    'https://l4d2center.com/maps/servers/index.json';

export interface L4d2CenterIndexEntry {
    name: string;
    size: number;
    md5: string;
    download_link: string;
}

export interface L4d2CenterCatalogOption extends L4d2CenterIndexEntry {
    installed: boolean;
}

function normalizeDownloadUrl(url: string): string {
    return url.trim().replace(/ /g, '%20');
}

function isCatalogEntryInstalled(entry: L4d2CenterIndexEntry, maps: MapEntry[]): boolean {
    const catalogUrl = normalizeDownloadUrl(entry.download_link);
    return maps.some(
        (map) =>
            map.source === MAP_SOURCES.L4D2CENTER &&
            map.downloadUrl &&
            normalizeDownloadUrl(map.downloadUrl) === catalogUrl
    );
}

export function enrichL4d2CenterCatalog(
    entries: L4d2CenterIndexEntry[],
    installedMaps: MapEntry[]
): L4d2CenterCatalogOption[] {
    return entries.map((entry) => ({
        ...entry,
        installed: isCatalogEntryInstalled(entry, installedMaps),
    }));
}

export async function fetchL4d2CenterCatalog(
    installedMaps: MapEntry[]
): Promise<L4d2CenterCatalogOption[]> {
    const response = await fetch(L4D2CENTER_INDEX_URL);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const entries = (await response.json()) as L4d2CenterIndexEntry[];
    return enrichL4d2CenterCatalog(entries, installedMaps).sort((a, b) =>
        a.name.localeCompare(b.name)
    );
}
