import type { CSSProperties } from 'react';
import { useCallback, useState } from 'react';
import { Button } from 'primereact/button';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { useMapsTranslations } from '../../hooks/useTranslations';
import { MapSuggestion } from '../../services/mapSuggestionsService';
import { openUrlInNewWindow } from './utils';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type MapSuggestionCardProps = {
    suggestion: MapSuggestion;
    mapsTranslations: MapsTranslations;
    isAdmin: boolean;
    acceptingId: number | null;
    denyingId: number | null;
    onAccept: (id: number) => void;
    onDeny: (id: number) => void;
    style?: CSSProperties;
};

export function MapSuggestionCard({
    suggestion,
    mapsTranslations,
    isAdmin,
    acceptingId,
    denyingId,
    onAccept,
    onDeny,
    style,
}: MapSuggestionCardProps) {
    const previewUrl = suggestion.preview_url?.trim() ?? '';
    const [imageFailed, setImageFailed] = useState(false);
    const showPhoto = Boolean(previewUrl) && !imageFailed;
    const isWorkshop = suggestion.source_kind === 'workshop';
    const sourceLabel = isWorkshop
        ? mapsTranslations.installSourceWorkshop
        : mapsTranslations.installSourceL4d2Center;
    const isAccepting = acceptingId === suggestion.id;
    const isDenying = denyingId === suggestion.id;
    const busy = isAccepting || isDenying;
    const conflict = suggestion.conflict?.kind === 'other_source' ? suggestion.conflict : null;

    const handleOpenLink = useCallback(() => {
        if (suggestion.download_link) {
            openUrlInNewWindow(suggestion.download_link);
        }
    }, [suggestion.download_link]);

    const visualClass =
        'workshop-map-card__visual map-suggestion-card__visual' +
        (showPhoto ? ' workshop-map-card__visual--with-preview' : '');

    return (
        <article className="workshop-map-card map-suggestion-card" style={style}>
            <div className={visualClass}>
                {showPhoto ? (
                    <img
                        className="workshop-map-card__photo"
                        src={previewUrl}
                        alt={suggestion.title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setImageFailed(true)}
                    />
                ) : null}
                <div className="workshop-map-card__visual-shade" aria-hidden />
                {isWorkshop ? (
                    <img
                        className="workshop-map-card__steam-mark"
                        src={ST_L}
                        alt=""
                        width={48}
                        height={48}
                    />
                ) : (
                    <span className="map-suggestion-card__source-mark" aria-hidden>
                        L4D2
                    </span>
                )}
                {suggestion.workshop_id ? (
                    <span
                        className="workshop-map-card__id"
                        title={mapsTranslations.workshopFileId}
                    >
                        ID {suggestion.workshop_id}
                    </span>
                ) : null}
            </div>
            <div className="workshop-map-card__body map-suggestion-card__body">
                <div className="workshop-map-card__title-row">
                    <h3 className="workshop-map-card__title">
                        {suggestion.download_link ? (
                            <a
                                href={suggestion.download_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="workshop-map-card__title-link"
                            >
                                {suggestion.title}
                            </a>
                        ) : (
                            suggestion.title
                        )}
                    </h3>
                </div>
                <div className="map-suggestion-card__meta">
                    <span className="map-suggestion-card__badge">{sourceLabel}</span>
                    <span className="map-suggestion-card__proposer">
                        {mapsTranslations.suggestProposedBy}: {suggestion.proposed_by}
                    </span>
                </div>
                {conflict ? (
                    <div className="map-suggestion-card__conflict" role="status">
                        {mapsTranslations.suggestConflictOtherSource(
                            conflict.installed_name,
                            conflict.installed_source
                        )}
                    </div>
                ) : null}
                <div className="workshop-map-card__actions map-suggestion-card__actions">
                    <button
                        type="button"
                        className="workshop-map-card__btn workshop-map-card__btn-secondary app-focus-ring"
                        onClick={handleOpenLink}
                        disabled={!suggestion.download_link}
                    >
                        {isWorkshop
                            ? mapsTranslations.openWorkshopPage
                            : mapsTranslations.suggestOpenSource}
                    </button>
                    {isAdmin ? (
                        <>
                            <Button
                                label={
                                    isAccepting
                                        ? mapsTranslations.suggestAccepting
                                        : mapsTranslations.suggestAccept
                                }
                                icon={isAccepting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                className="p-button-success p-button-sm app-focus-ring"
                                disabled={busy}
                                onClick={() => onAccept(suggestion.id)}
                            />
                            <Button
                                label={
                                    isDenying
                                        ? mapsTranslations.suggestDenying
                                        : mapsTranslations.suggestDeny
                                }
                                icon={isDenying ? 'pi pi-spin pi-spinner' : 'pi pi-times'}
                                className="p-button-danger p-button-sm app-focus-ring"
                                disabled={busy}
                                onClick={() => onDeny(suggestion.id)}
                            />
                        </>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
