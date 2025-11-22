/**
 * Constants for InstalledSVMaps component
 */

export const MAP_SOURCES = {
    WORKSHOP: 'Workshop',
    SIR_PLEASE: 'SirPlease',
    OTHER: 'Other',
} as const;

export const TRANSLATION_PLACEHOLDER = '__ALL_MAPS_TRANSLATION__';

export const STEAM_PROTOCOL_PREFIX = 'steam://url/CommunityFilePage/';

export const DIALOG_STYLES = {
    width: '90vw',
    maxWidth: '600px',
} as const;

export const CODE_BLOCK_STYLES = {
    display: 'block',
    padding: '0.75rem',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    borderRadius: '4px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-all' as const,
} as const;

export const BUTTON_CONTAINER_STYLES = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
} as const;

