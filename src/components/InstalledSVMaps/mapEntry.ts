/**
 * Single entry on the installed custom maps list.
 */
export interface MapEntry {
    mapName: string;
    source: 'Workshop' | 'SirPlease' | 'L4D2Center' | 'Other';
    downloadUrl?: string;
    /** Workshop cover: bare `https://images.steamusercontent.com/ugc/.../` (no query — see `normalizeWorkshopPreviewUrl`). */
    previewUrl?: string;
}
