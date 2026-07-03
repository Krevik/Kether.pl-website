import type { CSSProperties } from 'react';
import { useCallback, useId, useState } from 'react';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { MapEntry } from './mapEntry';
import { WorkshopMapPartRow } from './WorkshopMapPartRow';
import { useMapsTranslations } from '../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type WorkshopMapFolderCardProps = {
    folderName: string;
    previewUrl?: string;
    parts: MapEntry[];
    mapsTranslations: MapsTranslations;
    style?: CSSProperties;
    expanded: boolean;
    onToggle: () => void;
};

export function WorkshopMapFolderCard({
    folderName,
    previewUrl: rawPreviewUrl,
    parts,
    mapsTranslations,
    style,
    expanded,
    onToggle,
}: WorkshopMapFolderCardProps) {
    const partsPanelId = useId();
    const previewUrl = rawPreviewUrl?.trim() ?? '';
    const [imageFailed, setImageFailed] = useState(false);
    const showPhoto = Boolean(previewUrl) && !imageFailed;

    const handleToggle = useCallback(() => {
        onToggle();
    }, [onToggle]);

    const visualClass =
        'workshop-map-card__visual' + (showPhoto ? ' workshop-map-card__visual--with-preview' : '');

    const folderClass =
        'workshop-map-card workshop-map-folder' +
        (expanded ? ' workshop-map-folder--expanded' : '');

    return (
        <article className={folderClass} style={style}>
            <div className={visualClass}>
                {showPhoto ? (
                    <img
                        className="workshop-map-card__photo"
                        src={previewUrl}
                        alt={folderName}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setImageFailed(true)}
                    />
                ) : null}
                <div className="workshop-map-card__visual-shade" aria-hidden />
                <img className="workshop-map-card__steam-mark" src={ST_L} alt="" width={48} height={48} />
                <span className="workshop-map-folder__parts-badge">
                    {mapsTranslations.partsCount(parts.length)}
                </span>
            </div>
            <div className="workshop-map-card__body workshop-map-folder__body">
                <h3 className="workshop-map-card__title workshop-map-folder__title">{folderName}</h3>
                <button
                    type="button"
                    className="workshop-map-folder__toggle app-focus-ring"
                    onClick={handleToggle}
                    aria-expanded={expanded}
                    aria-controls={partsPanelId}
                >
                    {expanded ? mapsTranslations.collapseParts : mapsTranslations.expandParts}
                </button>
                {expanded ? (
                    <div
                        id={partsPanelId}
                        className="workshop-map-folder__parts"
                        role="region"
                        aria-label={folderName}
                    >
                        {parts.map((part, index) => (
                            <WorkshopMapPartRow
                                key={part.downloadUrl ?? `${part.mapName}-${index}`}
                                map={part}
                                indexInFolder={index}
                                mapsTranslations={mapsTranslations}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    );
}
