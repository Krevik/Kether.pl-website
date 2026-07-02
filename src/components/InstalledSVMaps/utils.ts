import { MapEntry } from './mapEntry';
import { TRANSLATION_PLACEHOLDER, STEAM_PROTOCOL_PREFIX } from './constants';
import { FALLBACK_INSTALLED_MAPS } from './mapsData.fallback';

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

export const normalizeMapName = (name: string): string => {
    let s = name.toLowerCase();
    for (const ext of ['.vpk', '.bsp']) {
        if (s.endsWith(ext)) {
            s = s.slice(0, -ext.length);
        }
    }

    return s
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
};

type PreviewIndex = {
    byWorkshopId: Map<string, string>;
    byNormalizedName: Map<string, string>;
};

let cachedPreviewIndex: PreviewIndex | null = null;

function buildPreviewIndex(): PreviewIndex {
    const byWorkshopId = new Map<string, string>();
    const byNormalizedName = new Map<string, string>();

    for (const entry of FALLBACK_INSTALLED_MAPS) {
        const preview = entry.previewUrl?.trim();
        if (!preview) continue;

        const workshopId = extractSteamWorkshopId(entry.downloadUrl);
        if (workshopId && !byWorkshopId.has(workshopId)) {
            byWorkshopId.set(workshopId, preview);
        }

        const normalized = normalizeMapName(entry.mapName);
        if (normalized && !byNormalizedName.has(normalized)) {
            byNormalizedName.set(normalized, preview);
        }
    }

    return { byWorkshopId, byNormalizedName };
}

function previewIndex(): PreviewIndex {
    if (!cachedPreviewIndex) {
        cachedPreviewIndex = buildPreviewIndex();
    }
    return cachedPreviewIndex;
}

/**
 * Fills missing workshop preview URLs using the static fallback map list.
 */
export const enrichMapsWithFallbackPreviews = (maps: MapEntry[]): MapEntry[] => {
    const index = previewIndex();

    return maps.map((map) => {
        if (map.source !== 'Workshop' || map.previewUrl?.trim()) {
            return map;
        }

        const workshopId = extractSteamWorkshopId(map.downloadUrl);
        const fromId = workshopId ? index.byWorkshopId.get(workshopId) : undefined;
        const fromName = index.byNormalizedName.get(normalizeMapName(map.mapName));
        const previewUrl = fromId ?? fromName;

        if (!previewUrl) {
            return map;
        }

        return { ...map, previewUrl };
    });
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
 * Alphabetical sort with an optional bundle pinned to the top (e.g. SirPlease all-maps pack).
 */
export const sortDownloadMaps = (
    maps: MapEntry[],
    pinFirstDownloadUrl?: string
): MapEntry[] => {
    const pin = pinFirstDownloadUrl?.trim();
    return [...maps].sort((a, b) => {
        if (pin) {
            const aPinned = a.downloadUrl?.trim() === pin;
            const bPinned = b.downloadUrl?.trim() === pin;
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
        }
        return a.mapName.localeCompare(b.mapName, undefined, { sensitivity: 'base' });
    });
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

