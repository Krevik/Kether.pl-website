import { useCallback, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import {
    applyAllMapUpdates,
    applyMapUpdate,
    MapUpdateItem,
    MapUpdatesStatus,
} from '../../../services/mapsManageService';
import { notificationManager } from '../../../utils/notificationManager';
import { useCommonTranslations, useMapsTranslations } from '../../../hooks/useTranslations';
import { DIALOG_STYLES } from '../constants';

export type MapUpdatesDetailsDialogProps = {
    visible: boolean;
    status: MapUpdatesStatus;
    onHide: () => void;
    onChanged: () => void | Promise<void>;
};

function sourceLabel(
    sourceKind: MapUpdateItem['sourceKind'],
    mapsTranslations: ReturnType<typeof useMapsTranslations>
): string {
    if (sourceKind === 'workshop') return mapsTranslations.updatesSourceWorkshop;
    if (sourceKind === 'l4d2center') return mapsTranslations.updatesSourceL4d2Center;
    return sourceKind;
}

export function MapUpdatesDetailsDialog({
    visible,
    status,
    onHide,
    onChanged,
}: MapUpdatesDetailsDialogProps) {
    const mapsTranslations = useMapsTranslations();
    const commonTranslations = useCommonTranslations();
    const [busyMapId, setBusyMapId] = useState<number | null>(null);
    const [updatingAll, setUpdatingAll] = useState(false);

    const busy = busyMapId !== null || updatingAll;

    const availableVisible = useMemo(() => {
        const inProgressIds = new Set(status.inProgress.map((item) => item.mapId));
        return status.available.filter((item) => !inProgressIds.has(item.mapId));
    }, [status]);

    const handleHide = () => {
        if (!busy) onHide();
    };

    const refreshAfterApply = useCallback(async () => {
        await onChanged();
    }, [onChanged]);

    const handleUpdateOne = async (mapId: number) => {
        setBusyMapId(mapId);
        try {
            const results = await applyMapUpdate(mapId);
            const result = results[0];
            if (result?.status === 'updated' || result?.status === 'up_to_date') {
                notificationManager.SUCCESS(
                    result.message || mapsTranslations.updatesApplySuccess
                );
            } else {
                notificationManager.ERROR(
                    result?.message || mapsTranslations.updatesApplyFailed
                );
            }
            await refreshAfterApply();
        } catch (error) {
            notificationManager.ERROR(
                `${mapsTranslations.updatesApplyFailed}: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
            await refreshAfterApply();
        } finally {
            setBusyMapId(null);
        }
    };

    const handleUpdateAll = async () => {
        if (availableVisible.length === 0) return;
        setUpdatingAll(true);
        try {
            const results = await applyAllMapUpdates();
            const updated = results.filter((r) => r.status === 'updated').length;
            const failed = results.filter((r) => r.status === 'failed').length;
            if (failed > 0) {
                notificationManager.ERROR(
                    `${mapsTranslations.updatesApplyFailed} (${failed}${
                        updated > 0 ? `, ${updated} ok` : ''
                    })`
                );
            } else {
                notificationManager.SUCCESS(
                    updated > 0
                        ? mapsTranslations.updatesApplySuccess
                        : mapsTranslations.manageUpdateResultUpToDate
                );
            }
            await refreshAfterApply();
        } catch (error) {
            notificationManager.ERROR(
                `${mapsTranslations.updatesApplyFailed}: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
            await refreshAfterApply();
        } finally {
            setUpdatingAll(false);
        }
    };

    const footer = (
        <div className="maps-install-dialog__footer">
            <Button
                label={commonTranslations.close}
                className="maps-install-dialog__btn maps-install-dialog__btn--secondary app-focus-ring"
                onClick={handleHide}
                disabled={busy}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            header={mapsTranslations.updatesDetailsTitle}
            modal
            className="p-fluid app-dialog maps-install-dialog maps-updates-dialog"
            headerClassName="maps-install-dialog__header"
            contentClassName="maps-install-dialog__content"
            maskClassName="maps-install-dialog__mask"
            style={DIALOG_STYLES}
            footer={footer}
            onHide={handleHide}
            closable={!busy}
        >
            <section className="maps-updates-dialog__section" aria-labelledby="maps-updates-in-progress">
                <div className="maps-updates-dialog__section-head">
                    <h3 id="maps-updates-in-progress">{mapsTranslations.updatesSectionInProgress}</h3>
                </div>
                {status.inProgress.length === 0 ? (
                    <p className="maps-updates-dialog__empty">{mapsTranslations.updatesEmptySection}</p>
                ) : (
                    <ul className="maps-updates-dialog__list">
                        {status.inProgress.map((item) => {
                            const label = mapsTranslations.updatesPhaseLabel(item);
                            const hasPercent = typeof item.percent === 'number';
                            return (
                                <li
                                    key={`progress-${item.mapId}`}
                                    className="maps-updates-dialog__row maps-updates-dialog__row--progress"
                                >
                                    <div className="maps-updates-dialog__meta">
                                        <span className="maps-updates-dialog__name">
                                            #{item.mapId} {item.name}
                                        </span>
                                        <span className="maps-updates-dialog__source">
                                            {sourceLabel(item.sourceKind, mapsTranslations)}
                                        </span>
                                        <span className="maps-updates-dialog__phase">{label}</span>
                                    </div>
                                    <div className="maps-updates-dialog__progress-wrap">
                                        <ProgressBar
                                            className="maps-updates-dialog__progress"
                                            value={hasPercent ? item.percent : undefined}
                                            mode={hasPercent ? 'determinate' : 'indeterminate'}
                                            showValue={hasPercent}
                                            aria-label={label}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <section className="maps-updates-dialog__section" aria-labelledby="maps-updates-available">
                <div className="maps-updates-dialog__section-head">
                    <h3 id="maps-updates-available">{mapsTranslations.updatesSectionAvailable}</h3>
                    <Button
                        label={
                            updatingAll
                                ? mapsTranslations.updatesUpdating
                                : mapsTranslations.updatesUpdateAll
                        }
                        className="p-button-sm maps-updates-dialog__update-all app-focus-ring"
                        onClick={handleUpdateAll}
                        disabled={busy || availableVisible.length === 0}
                    />
                </div>
                {availableVisible.length === 0 ? (
                    <p className="maps-updates-dialog__empty">{mapsTranslations.updatesEmptySection}</p>
                ) : (
                    <ul className="maps-updates-dialog__list">
                        {availableVisible.map((item) => {
                            const rowBusy = busyMapId === item.mapId || updatingAll;
                            return (
                                <li key={`available-${item.mapId}`} className="maps-updates-dialog__row">
                                    <div className="maps-updates-dialog__meta">
                                        <span className="maps-updates-dialog__name">
                                            #{item.mapId} {item.name}
                                        </span>
                                        <span className="maps-updates-dialog__source">
                                            {sourceLabel(item.sourceKind, mapsTranslations)}
                                        </span>
                                    </div>
                                    <Button
                                        label={
                                            rowBusy
                                                ? mapsTranslations.updatesUpdating
                                                : mapsTranslations.updatesUpdate
                                        }
                                        className="p-button-sm app-focus-ring"
                                        onClick={() => handleUpdateOne(item.mapId)}
                                        disabled={busy}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </Dialog>
    );
}
