import { useCallback, useMemo, useState } from 'react';
import { MapEntry } from './mapEntry';
import { groupWorkshopMaps, workshopFolderKey, MapSortField, MapSortDirection } from './utils';
import { WorkshopMapCard } from './WorkshopMapCard';
import { WorkshopMapFolderCard } from './WorkshopMapFolderCard';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type WorkshopMapsGridProps = {
    maps: MapEntry[];
    mapsTranslations: MapsTranslations;
    /** Shown when `maps` is empty (e.g. no search hits vs. no data at all) */
    zeroStateMessage?: string;
    isAdmin: boolean;
    onManage: (id: number) => void;
    onInfo: (id: number) => void;
    sortField?: MapSortField;
    sortDirection?: MapSortDirection;
};

export function WorkshopMapsGrid({
    maps,
    mapsTranslations,
    zeroStateMessage,
    isAdmin,
    onManage,
    onInfo,
    sortField = 'name',
    sortDirection = 'asc',
}: WorkshopMapsGridProps) {
    const [expandedFolderKey, setExpandedFolderKey] = useState<string | null>(null);

    const items = useMemo(
        () => groupWorkshopMaps(maps, sortField, sortDirection),
        [maps, sortField, sortDirection]
    );

    const handleFolderToggle = useCallback((folderKey: string) => {
        setExpandedFolderKey((current) => (current === folderKey ? null : folderKey));
    }, []);

    if (items.length === 0) {
        return <p className="maps-empty">{zeroStateMessage ?? mapsTranslations.noMapsAvailable}</p>;
    }

    return (
        <div className="workshop-maps-section">
            <div className="workshop-maps-grid">
                {items.map((item, index) => {
                    const style = { animationDelay: `${Math.min(index, 24) * 35}ms` };

                    if (item.kind === 'folder') {
                        const folderKey = workshopFolderKey(item);
                        return (
                            <WorkshopMapFolderCard
                                key={folderKey}
                                folderName={item.folderName}
                                previewUrl={item.previewUrl}
                                parts={item.parts}
                                mapsTranslations={mapsTranslations}
                                style={style}
                                expanded={expandedFolderKey === folderKey}
                                onToggle={() => handleFolderToggle(folderKey)}
                                isAdmin={isAdmin}
                                onManage={onManage}
                                onInfo={onInfo}
                            />
                        );
                    }

                    return (
                        <WorkshopMapCard
                            key={item.map.downloadUrl ?? item.map.mapName}
                            map={item.map}
                            mapsTranslations={mapsTranslations}
                            isAdmin={isAdmin}
                            onManage={onManage}
                            onInfo={onInfo}
                            style={style}
                        />
                    );
                })}
            </div>
        </div>
    );
}
