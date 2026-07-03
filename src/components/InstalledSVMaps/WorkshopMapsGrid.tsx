import { useCallback, useMemo, useState } from 'react';
import { MapEntry } from './mapEntry';
import { groupWorkshopMaps, workshopFolderKey } from './utils';
import { WorkshopMapCard } from './WorkshopMapCard';
import { WorkshopMapFolderCard } from './WorkshopMapFolderCard';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type WorkshopMapsGridProps = {
    maps: MapEntry[];
    mapsTranslations: MapsTranslations;
    /** Shown when `maps` is empty (e.g. no search hits vs. no data at all) */
    zeroStateMessage?: string;
};

export function WorkshopMapsGrid({ maps, mapsTranslations, zeroStateMessage }: WorkshopMapsGridProps) {
    const [expandedFolderKey, setExpandedFolderKey] = useState<string | null>(null);

    const items = useMemo(() => groupWorkshopMaps(maps), [maps]);

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
                            />
                        );
                    }

                    return (
                        <WorkshopMapCard
                            key={item.map.downloadUrl ?? item.map.mapName}
                            map={item.map}
                            mapsTranslations={mapsTranslations}
                            style={style}
                        />
                    );
                })}
            </div>
        </div>
    );
}
