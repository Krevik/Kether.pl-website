export type MapInfoButtonProps = {
    mapId?: number;
    isAdmin: boolean;
    tooltip: string;
    onInfo: (id: number) => void;
};

/**
 * Read-only counterpart to `ManageMapButton` — shown only to non-admins, who can
 * see the checksum/installed date but not manage (update/remove) the addon.
 */
export function MapInfoButton({ mapId, isAdmin, tooltip, onInfo }: MapInfoButtonProps) {
    if (isAdmin || mapId === undefined) {
        return null;
    }

    return (
        <button
            type="button"
            className="maps-info-button app-focus-ring"
            title={tooltip}
            aria-label={tooltip}
            onClick={() => onInfo(mapId)}
        >
            <span aria-hidden>ℹ️</span>
        </button>
    );
}
