import { useMemo } from 'react';
import { MapEntry } from './mapEntry';
import { dedupeMapsByDownloadUrl, sortDownloadMaps } from './utils';
import { DownloadMapRow } from './DownloadMapRow';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type DownloadMapsListProps = {
    maps: MapEntry[];
    isAdmin: boolean;
    mapsTranslations: MapsTranslations;
    onHelpClick?: () => void;
    emptyMessage?: string;
    /** Keeps a bundle (e.g. all-maps zip) at the top before alphabetical order */
    pinFirstDownloadUrl?: string;
};

export function DownloadMapsList({
    maps,
    isAdmin,
    mapsTranslations,
    onHelpClick,
    emptyMessage,
    pinFirstDownloadUrl,
}: DownloadMapsListProps) {
    const sorted = useMemo(() => {
        const unique = dedupeMapsByDownloadUrl(maps);
        return sortDownloadMaps(unique, pinFirstDownloadUrl);
    }, [maps, pinFirstDownloadUrl]);

    if (sorted.length === 0) {
        return (
            <p className="maps-empty">
                {emptyMessage ?? mapsTranslations.noMapsAvailable}
            </p>
        );
    }

    return (
        <div className="download-maps-section">
            <ul className="download-maps-list" role="list">
                {sorted.map((map, index) => (
                    <li
                        key={map.downloadUrl ?? map.mapName}
                        className="download-maps-list__item"
                        style={{ animationDelay: `${Math.min(index, 32) * 28}ms` }}
                    >
                        <DownloadMapRow
                            map={map}
                            rowIndex={index}
                            showIndex={isAdmin}
                            mapsTranslations={mapsTranslations}
                            onHelpClick={onHelpClick}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
