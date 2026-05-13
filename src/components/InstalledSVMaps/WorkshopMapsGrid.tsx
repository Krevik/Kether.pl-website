import { useMemo } from 'react';
import { MapEntry } from './mapEntry';
import { dedupeMapsByDownloadUrl } from './utils';
import { WorkshopMapCard } from './WorkshopMapCard';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type WorkshopMapsGridProps = {
    maps: MapEntry[];
    mapsTranslations: MapsTranslations;
};

export function WorkshopMapsGrid({ maps, mapsTranslations }: WorkshopMapsGridProps) {
    const sorted = useMemo(() => {
        const unique = dedupeMapsByDownloadUrl(maps);
        return [...unique].sort((a, b) => a.mapName.localeCompare(b.mapName, undefined, { sensitivity: 'base' }));
    }, [maps]);

    if (sorted.length === 0) {
        return <p className="maps-empty">{mapsTranslations.noMapsAvailable}</p>;
    }

    return (
        <div className="workshop-maps-section">
            <div className="workshop-maps-grid">
                {sorted.map((map, index) => (
                    <WorkshopMapCard
                        key={map.downloadUrl ?? map.mapName}
                        map={map}
                        mapsTranslations={mapsTranslations}
                        style={{ animationDelay: `${Math.min(index, 24) * 35}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
