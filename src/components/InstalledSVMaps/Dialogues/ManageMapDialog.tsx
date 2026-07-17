import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import {
    checkMapUpdate,
    fetchMapDetail,
    MapManageDetail,
    uninstallMap,
    UpdateCheckResult,
} from '../../../services/mapsManageService';
import { notificationManager } from '../../../utils/notificationManager';
import { useCommonTranslations, useMapsTranslations } from '../../../hooks/useTranslations';
import { DIALOG_STYLES } from '../constants';
import { DialogManageMapContent } from './DialogManageMapContent';

export type ManageMapDialogProps = {
    isDialogVisible: boolean;
    mapId: number | null;
    onHide: () => void;
    onRemoved: () => void;
    onUpdated: (options?: { reloadMaps?: boolean }) => void | Promise<void>;
    onUpdateStarted?: (item: {
        name: string;
        mapId: number;
        sourceKind: MapManageDetail['sourceKind'];
    }) => void;
};

export function ManageMapDialog({
    isDialogVisible,
    mapId,
    onHide,
    onRemoved,
    onUpdated,
    onUpdateStarted,
}: ManageMapDialogProps) {
    const mapsTranslations = useMapsTranslations();
    const commonTranslations = useCommonTranslations();
    const [detail, setDetail] = useState<MapManageDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);
    const [operation, setOperation] = useState<'update' | 'remove' | null>(null);

    useEffect(() => {
        if (!isDialogVisible || mapId === null) {
            return;
        }

        let cancelled = false;
        setDetail(null);
        setLoadError(null);
        setUpdateResult(null);
        setLoading(true);

        fetchMapDetail(mapId)
            .then((value) => {
                if (!cancelled) setDetail(value);
            })
            .catch((error: Error) => {
                if (!cancelled) setLoadError(error.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isDialogVisible, mapId]);

    const busy = operation !== null;
    const supportsUpdates =
        detail?.sourceKind === 'workshop' || detail?.sourceKind === 'l4d2center';

    const handleHide = () => {
        if (!busy) onHide();
    };

    const handleCheckUpdate = async () => {
        if (mapId === null || !supportsUpdates || !detail) return;

        onUpdateStarted?.({
            name: detail.name,
            mapId: detail.id,
            sourceKind: detail.sourceKind,
        });
        setOperation('update');
        setUpdateResult(null);
        try {
            const result = await checkMapUpdate(mapId);
            setUpdateResult(result);
            if (result.map) setDetail(result.map);

            if (result.status === 'updated') {
                notificationManager.SUCCESS(mapsTranslations.manageUpdateResultUpdated);
                await onUpdated({ reloadMaps: true });
            } else if (result.status === 'up_to_date') {
                notificationManager.SUCCESS(mapsTranslations.manageUpdateResultUpToDate);
                await onUpdated();
            } else if (result.status === 'unsupported') {
                notificationManager.ERROR(mapsTranslations.manageUpdateResultUnsupported);
                await onUpdated();
            } else {
                notificationManager.ERROR(
                    `${mapsTranslations.manageUpdateResultFailed}: ${result.message}`
                );
                await onUpdated();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            notificationManager.ERROR(`${mapsTranslations.manageUpdateResultFailed}: ${message}`);
            await onUpdated();
        } finally {
            setOperation(null);
        }
    };

    const handleRemove = async () => {
        if (mapId === null || !detail) return;
        if (!window.confirm(mapsTranslations.manageRemoveConfirm(detail.name))) return;

        setOperation('remove');
        try {
            await uninstallMap(mapId);
            notificationManager.SUCCESS(mapsTranslations.manageRemoveSuccess);
            onHide();
            onRemoved();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            notificationManager.ERROR(`${mapsTranslations.manageRemoveFailed}: ${message}`);
        } finally {
            setOperation(null);
        }
    };

    const footer = (
        <div className="maps-install-dialog__footer-actions maps-manage-dialog__footer-actions">
            <Button
                label={commonTranslations.close}
                className="maps-install-dialog__btn maps-install-dialog__btn-cancel app-focus-ring"
                onClick={handleHide}
                disabled={busy}
            />
            <Button
                label={
                    operation === 'update'
                        ? mapsTranslations.manageCheckUpdateInProgress
                        : mapsTranslations.manageCheckUpdate
                }
                className="maps-install-dialog__btn maps-install-dialog__btn-update app-focus-ring"
                onClick={handleCheckUpdate}
                disabled={busy || loading || !supportsUpdates}
                title={
                    detail && !supportsUpdates
                        ? mapsTranslations.manageUpdateResultUnsupported
                        : undefined
                }
            />
            <Button
                label={
                    operation === 'remove'
                        ? mapsTranslations.manageRemoveInProgress
                        : mapsTranslations.manageRemoveAddon
                }
                className="maps-install-dialog__btn maps-install-dialog__btn-danger app-focus-ring"
                onClick={handleRemove}
                disabled={busy || loading || !detail}
            />
        </div>
    );

    return (
        <Dialog
            visible={isDialogVisible}
            header={mapsTranslations.manageMap}
            modal
            className="p-fluid app-dialog maps-install-dialog maps-manage-dialog"
            headerClassName="maps-install-dialog__header"
            contentClassName="maps-install-dialog__content"
            maskClassName="maps-install-dialog__mask"
            style={DIALOG_STYLES}
            footer={footer}
            onHide={handleHide}
            closable={!busy}
        >
            <DialogManageMapContent
                detail={detail}
                loading={loading}
                loadError={loadError}
                updateResult={updateResult}
                mapsTranslations={mapsTranslations}
            />
        </Dialog>
    );
}
