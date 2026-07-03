import { useCallback } from 'react';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { MapEntry } from './mapEntry';
import {
    extractSteamWorkshopId,
    getWorkshopPartNumber,
    openSteamWorkshopPage,
    openUrlInNewWindow,
    parseWorkshopPartName,
} from './utils';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type WorkshopMapPartRowProps = {
    map: MapEntry;
    indexInFolder: number;
    mapsTranslations: MapsTranslations;
};

export function WorkshopMapPartRow({
    map,
    indexInFolder,
    mapsTranslations,
}: WorkshopMapPartRowProps) {
    const workshopId = extractSteamWorkshopId(map.downloadUrl);
    const partNumber = getWorkshopPartNumber(map, indexInFolder);
    const partLabel = mapsTranslations.partLabel(partNumber);
    const parsed = parseWorkshopPartName(map.mapName);
    const showSubtitle =
        map.mapName.trim().toLowerCase() !== parsed.baseName.toLowerCase();

    const handleInstall = useCallback(() => {
        if (workshopId) {
            openSteamWorkshopPage(workshopId);
        } else if (map.downloadUrl) {
            openUrlInNewWindow(map.downloadUrl);
        }
    }, [workshopId, map.downloadUrl]);

    const handleOpenWeb = useCallback(() => {
        if (map.downloadUrl) {
            openUrlInNewWindow(map.downloadUrl);
        }
    }, [map.downloadUrl]);

    return (
        <div className="workshop-map-part-row">
            <div className="workshop-map-part-row__info">
                <span className="workshop-map-part-row__label">{partLabel}</span>
                {workshopId ? (
                    <span className="workshop-map-part-row__id" title={mapsTranslations.workshopFileId}>
                        ID {workshopId}
                    </span>
                ) : null}
                {showSubtitle ? (
                    <span className="workshop-map-part-row__subtitle">{map.mapName}</span>
                ) : null}
            </div>
            <div className="workshop-map-part-row__actions">
                <button
                    type="button"
                    className="workshop-map-card__btn workshop-map-card__btn-secondary app-focus-ring"
                    onClick={handleOpenWeb}
                    disabled={!map.downloadUrl}
                >
                    {mapsTranslations.openWorkshopPage}
                </button>
                <button
                    type="button"
                    className="workshop-map-card__btn workshop-map-card__btn-primary app-focus-ring"
                    onClick={handleInstall}
                >
                    <img src={ST_L} width={20} height={20} alt="" className="workshop-map-card__btn-icon" />
                    <span>{mapsTranslations.install}</span>
                </button>
            </div>
        </div>
    );
}
