import { MapEntry } from './mapEntry';
import { TRANSLATION_PLACEHOLDER, STEAM_PROTOCOL_PREFIX } from './constants';

/**
 * Extracts Steam Workshop ID from a downloadUrl
 * @param downloadUrl - The download URL (e.g., 'https://steamcommunity.com/sharedfiles/filedetails/?id=381419931')
 * @returns The extracted ID or null if not found
 */
export const extractSteamWorkshopId = (downloadUrl: string | undefined): string | null => {
    if (!downloadUrl) return null;
    
    const match = downloadUrl.match(/[?&]id=(\d+)/);
    return match ? match[1] : null;
};

/**
 * Opens Steam Workshop page for the given workshop ID
 */
export const openSteamWorkshopPage = (workshopId: string): void => {
    window.open(`${STEAM_PROTOCOL_PREFIX}${workshopId}`, '_blank');
};

/**
 * Opens a URL in a new window
 */
export const openUrlInNewWindow = (url: string): void => {
    window.open(url, '_blank');
};

/**
 * Steam UGC image CDN: target box for card hero (~2× logical width for retina, ~2:1 strip).
 * Tweak here if you change `.workshop-map-card__visual` size in CSS.
 */
const STEAM_PREVIEW_IMW = '800';
const STEAM_PREVIEW_IMH = '400';

function isSteamWorkshopPreviewHost(hostname: string): boolean {
    const h = hostname.toLowerCase();
    return (
        h === 'images.steamusercontent.com' ||
        h.endsWith('.steamusercontent.com') ||
        h.includes('steamuserimages')
    );
}

/**
 * Rewrites Steam workshop preview asset URLs: strips any pasted query/hash, then applies
 * consistent CDN sizing (`imw` / `imh` / `ima` / …) for map cards. Non-Steam URLs are unchanged.
 */
export const normalizeWorkshopPreviewUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;

    let url: URL;
    try {
        url = new URL(trimmed);
    } catch {
        return trimmed;
    }

    if (!isSteamWorkshopPreviewHost(url.hostname)) {
        return trimmed;
    }

    /* Data files store bare asset URLs; sizing always owned by this helper. */
    url.search = '';
    url.hash = '';

    url.searchParams.set('imw', STEAM_PREVIEW_IMW);
    url.searchParams.set('imh', STEAM_PREVIEW_IMH);
    url.searchParams.set('ima', 'fit');
    url.searchParams.set('impolicy', 'Letterbox');
    url.searchParams.set('imcolor', '#000000');
    url.searchParams.set('letterbox', 'false');

    return url.toString();
};

/**
 * Processes maps array by replacing translation placeholders
 */
export const processMapsWithTranslations = (
    maps: MapEntry[],
    allMapsTranslation: string
): MapEntry[] => {
    return maps.map((map) => {
        const withName =
            map.mapName === TRANSLATION_PLACEHOLDER
                ? { ...map, mapName: allMapsTranslation }
                : { ...map };

        if (withName.previewUrl?.trim()) {
            return {
                ...withName,
                previewUrl: normalizeWorkshopPreviewUrl(withName.previewUrl),
            };
        }

        return withName;
    });
};

/**
 * Filters maps by source type
 */
export const filterMapsBySource = (
    maps: MapEntry[],
    source: MapEntry['source']
): MapEntry[] => {
    return maps.filter(map => map.source === source);
};

/**
 * Case-insensitive substring match on `mapName`. Empty / whitespace query returns `maps` unchanged.
 */
export const filterMapsByNameQuery = (maps: MapEntry[], query: string): MapEntry[] => {
    const q = query.trim().toLowerCase();
    if (!q) return maps;
    return maps.filter((m) => m.mapName.toLowerCase().includes(q));
};

/**
 * First occurrence wins — cleaner grid when the same workshop URL appears twice in data.
 */
export const dedupeMapsByDownloadUrl = (maps: MapEntry[]): MapEntry[] => {
    const seen = new Set<string>();
    const out: MapEntry[] = [];
    for (const m of maps) {
        const key = m.downloadUrl?.trim() || m.mapName;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(m);
    }
    return out;
};

