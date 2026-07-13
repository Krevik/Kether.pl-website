import type { CSSProperties } from 'react';
import { MapEntry } from './mapEntry';
import { openUrlInNewWindow } from './utils';
import { useMapsTranslations } from '../../hooks/useTranslations';
import { ManageMapButton } from './ManageMapButton';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type DownloadMapRowProps = {
    map: MapEntry;
    rowIndex: number;
    showIndex: boolean;
    isAdmin: boolean;
    onManage: (id: number) => void;
    mapsTranslations: MapsTranslations;
    onHelpClick?: () => void;
    style?: CSSProperties;
};

export function DownloadMapRow({
    map,
    rowIndex,
    showIndex,
    isAdmin,
    onManage,
    mapsTranslations,
    onHelpClick,
    style,
}: DownloadMapRowProps) {
    const handleDownload = () => {
        if (map.downloadUrl) {
            openUrlInNewWindow(map.downloadUrl);
        }
    };

    return (
        <article className="download-map-row" style={style}>
            <div className="download-map-row__main">
                {showIndex ? (
                    <span className="download-map-row__index" aria-hidden>
                        {rowIndex + 1}
                    </span>
                ) : null}
                <h3 className="download-map-row__title">
                    {map.downloadUrl ? (
                        <a
                            href={map.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-map-row__title-link"
                        >
                            {map.mapName}
                        </a>
                    ) : (
                        map.mapName
                    )}
                </h3>
                <ManageMapButton
                    mapId={map.id}
                    isAdmin={isAdmin}
                    tooltip={mapsTranslations.manageMapTooltip}
                    onManage={onManage}
                />
            </div>
            <div className="download-map-row__actions">
                <button
                    type="button"
                    className="download-map-row__btn download-map-row__btn-primary app-focus-ring"
                    onClick={handleDownload}
                    disabled={!map.downloadUrl}
                >
                    <span className="download-map-row__btn-icon" aria-hidden>
                        🌐
                    </span>
                    <span>{mapsTranslations.download}</span>
                </button>
                {onHelpClick ? (
                    <button
                        type="button"
                        className="download-map-row__btn download-map-row__btn-help app-focus-ring"
                        onClick={onHelpClick}
                        title={mapsTranslations.installationHelp}
                        aria-label={mapsTranslations.installationHelp}
                    >
                        ?
                    </button>
                ) : null}
            </div>
        </article>
    );
}
