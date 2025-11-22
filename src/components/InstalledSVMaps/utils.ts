import { MapEntry } from './InstalledSVMaps';
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
 * Processes maps array by replacing translation placeholders
 */
export const processMapsWithTranslations = (
    maps: MapEntry[],
    allMapsTranslation: string
): MapEntry[] => {
    return maps.map(map => {
        if (map.mapName === TRANSLATION_PLACEHOLDER) {
            return { ...map, mapName: allMapsTranslation };
        }
        return map;
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

