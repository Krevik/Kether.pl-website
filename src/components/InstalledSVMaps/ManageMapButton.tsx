export type ManageMapButtonProps = {
    mapId?: number;
    isAdmin: boolean;
    tooltip: string;
    onManage: (id: number) => void;
};

export function ManageMapButton({
    mapId,
    isAdmin,
    tooltip,
    onManage,
}: ManageMapButtonProps) {
    if (!isAdmin || mapId === undefined) {
        return null;
    }

    return (
        <button
            type="button"
            className="maps-manage-button app-focus-ring"
            title={tooltip}
            aria-label={tooltip}
            onClick={() => onManage(mapId)}
        >
            <span aria-hidden>⚙️</span>
        </button>
    );
}
