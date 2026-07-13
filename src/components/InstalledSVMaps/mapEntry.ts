/**
 * Single entry on the installed custom maps list.
 */
export interface MapEntry {
    /** Daemon registry ID. Missing only for local fallback/synthetic entries. */
    id?: number;
    mapName: string;
    source: 'Workshop' | 'SirPlease' | 'L4D2Center' | 'Other';
    downloadUrl?: string;
    /** Workshop cover: bare `https://images.steamusercontent.com/ugc/.../` (no query — see `normalizeWorkshopPreviewUrl`). */
    previewUrl?: string;
}
