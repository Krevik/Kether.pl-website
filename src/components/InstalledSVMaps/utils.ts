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

export type WorkshopGridItem =
    | { kind: 'single'; map: MapEntry }
    | { kind: 'folder'; folderName: string; previewUrl?: string; parts: MapEntry[] };

export type ParsedWorkshopPart = {
    baseName: string;
    partNumber: number | null;
};

const WORKSHOP_PART_SUFFIX_RE = /^(.+?)\s+part\s+(\d+)\s*$/i;
const WORKSHOP_PART_OF_RE = /^(.+?):\s*part\s+(\d+)\s+of\s+\d+\s*$/i;

/**
 * Extracts campaign base title and optional part number from workshop map names.
 */
export const parseWorkshopPartName = (mapName: string): ParsedWorkshopPart => {
    const trimmed = mapName.trim();

    const partOfMatch = trimmed.match(WORKSHOP_PART_OF_RE);
    if (partOfMatch) {
        return {
            baseName: partOfMatch[1].trim(),
            partNumber: Number.parseInt(partOfMatch[2], 10),
        };
    }

    const partSuffixMatch = trimmed.match(WORKSHOP_PART_SUFFIX_RE);
    if (partSuffixMatch) {
        return {
            baseName: partSuffixMatch[1].trim(),
            partNumber: Number.parseInt(partSuffixMatch[2], 10),
        };
    }

    return { baseName: trimmed, partNumber: null };
};

function workshopGroupingKey(baseName: string): string {
    return baseName.trim().replace(/\s+/g, ' ').toLowerCase();
}

function workshopIdNumeric(map: MapEntry): number {
    const id = extractSteamWorkshopId(map.downloadUrl);
    return id ? Number.parseInt(id, 10) : 0;
}

function implicitPartNumber(map: MapEntry, parsed: ParsedWorkshopPart): number {
    if (parsed.partNumber !== null) {
        return parsed.partNumber;
    }
    if (map.mapName.trim().toLowerCase() === parsed.baseName.toLowerCase()) {
        return 1;
    }
    return Number.MAX_SAFE_INTEGER;
}

function sortWorkshopParts(parts: MapEntry[]): MapEntry[] {
    return [...parts].sort((a, b) => {
        const parsedA = parseWorkshopPartName(a.mapName);
        const parsedB = parseWorkshopPartName(b.mapName);
        const numA = implicitPartNumber(a, parsedA);
        const numB = implicitPartNumber(b, parsedB);
        if (numA !== numB) return numA - numB;

        const idDiff = workshopIdNumeric(a) - workshopIdNumeric(b);
        if (idDiff !== 0) return idDiff;

        return a.mapName.localeCompare(b.mapName, undefined, { sensitivity: 'base' });
    });
}

function pickFolderDisplayName(parts: MapEntry[]): string {
    const baseNames = parts.map((part) => parseWorkshopPartName(part.mapName).baseName);
    return baseNames.reduce((shortest, name) =>
        name.length < shortest.length ? name : shortest
    );
}

function pickFolderPreviewUrl(parts: MapEntry[]): string | undefined {
    for (const part of parts) {
        const preview = part.previewUrl?.trim();
        if (preview) return preview;
    }
    return undefined;
}

/**
 * Groups workshop maps into single cards or multi-part folder cards.
 */
export const groupWorkshopMaps = (maps: MapEntry[]): WorkshopGridItem[] => {
    const unique = dedupeMapsByDownloadUrl(maps);
    const buckets = new Map<string, MapEntry[]>();

    for (const map of unique) {
        const { baseName } = parseWorkshopPartName(map.mapName);
        const key = workshopGroupingKey(baseName);
        const bucket = buckets.get(key) ?? [];
        bucket.push(map);
        buckets.set(key, bucket);
    }

    const items: WorkshopGridItem[] = [];

    for (const parts of buckets.values()) {
        const sorted = sortWorkshopParts(parts);
        if (sorted.length >= 2) {
            items.push({
                kind: 'folder',
                folderName: pickFolderDisplayName(sorted),
                previewUrl: pickFolderPreviewUrl(sorted),
                parts: sorted,
            });
        } else if (sorted.length === 1) {
            items.push({ kind: 'single', map: sorted[0] });
        }
    }

    return items.sort((a, b) => {
        const nameA = a.kind === 'folder' ? a.folderName : a.map.mapName;
        const nameB = b.kind === 'folder' ? b.folderName : b.map.mapName;
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });
};

export const workshopGridItemSortName = (item: WorkshopGridItem): string =>
    item.kind === 'folder' ? item.folderName : item.map.mapName;

export const workshopFolderKey = (folder: Extract<WorkshopGridItem, { kind: 'folder' }>): string => {
    const firstId = extractSteamWorkshopId(folder.parts[0]?.downloadUrl) ?? '0';
    return `${folder.folderName}:${firstId}`;
};

/**
 * Display part number for folder children (explicit suffix or implicit order).
 */
export const getWorkshopPartNumber = (map: MapEntry, indexInFolder: number): number => {
    const parsed = parseWorkshopPartName(map.mapName);
    if (parsed.partNumber !== null) {
        return parsed.partNumber;
    }
    if (map.mapName.trim().toLowerCase() === parsed.baseName.toLowerCase()) {
        return 1;
    }
    return indexInFolder + 1;
};

