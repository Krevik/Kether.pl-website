import type { CSSProperties } from 'react';
import { useCallback, useState } from 'react';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { MapEntry } from './mapEntry';
import { extractSteamWorkshopId, openSteamWorkshopPage, openUrlInNewWindow } from './utils';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type WorkshopMapCardProps = {
    map: MapEntry;
    mapsTranslations: MapsTranslations;
    style?: CSSProperties;
};

export function WorkshopMapCard({ map, mapsTranslations, style }: WorkshopMapCardProps) {
    const workshopId = extractSteamWorkshopId(map.downloadUrl);
    const previewUrl = map.previewUrl?.trim() ?? '';
    const [imageFailed, setImageFailed] = useState(false);
    const showPhoto = Boolean(previewUrl) && !imageFailed;

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

    const visualClass =
        'workshop-map-card__visual' + (showPhoto ? ' workshop-map-card__visual--with-preview' : '');

    return (
        <article className="workshop-map-card" style={style}>
            <div className={visualClass}>
                {showPhoto ? (
                    <img
                        className="workshop-map-card__photo"
                        src={previewUrl}
                        alt={map.mapName}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setImageFailed(true)}
                    />
                ) : null}
                <div className="workshop-map-card__visual-shade" aria-hidden />
                <img className="workshop-map-card__steam-mark" src={ST_L} alt="" width={48} height={48} />
                {workshopId ? (
                    <span className="workshop-map-card__id" title={mapsTranslations.workshopFileId}>
                        ID {workshopId}
                    </span>
                ) : null}
            </div>
            <div className="workshop-map-card__body">
                <h3 className="workshop-map-card__title">
                    <a
                        href={map.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="workshop-map-card__title-link"
                    >
                        {map.mapName}
                    </a>
                </h3>
                <div className="workshop-map-card__actions">
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
        </article>
    );
}
