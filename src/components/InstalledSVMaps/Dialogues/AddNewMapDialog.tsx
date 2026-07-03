import { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DialogAddMapContent } from './DialogAddMapContent';
import {
    buildInstallPayload,
    InstallSourceMode,
    validateInstallPayload,
} from '../installMapUtils';
import { fetchL4d2CenterCatalog, L4d2CenterCatalogOption } from '../l4d2centerCatalog';
import { MapEntry } from '../mapEntry';
import { installMap } from '../../../services/mapsAdminService';
import { DIALOG_STYLES } from '../constants';
import { notificationManager } from '../../../utils/notificationManager';
import { useCommonTranslations, useMapsTranslations } from '../../../hooks/useTranslations';

export type AddNewMapDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    onInstalled: () => void;
    installedMaps: MapEntry[];
};

export function AddNewMapDialog({
    isDialogVisible,
    setDialogVisibility,
    onInstalled,
    installedMaps,
}: AddNewMapDialogProps) {
    const mapsTranslations = useMapsTranslations();
    const commonTranslations = useCommonTranslations();
    const [mode, setMode] = useState<InstallSourceMode>('auto');
    const [input, setInput] = useState('');
    const [nameOverride, setNameOverride] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [l4d2centerOptions, setL4d2centerOptions] = useState<L4d2CenterCatalogOption[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(false);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    const catalogNames = useMemo(
        () => l4d2centerOptions.map((entry) => entry.name),
        [l4d2centerOptions]
    );

    const resetForm = () => {
        setMode('auto');
        setInput('');
        setNameOverride('');
    };

    useEffect(() => {
        if (!isDialogVisible) {
            return;
        }

        setCatalogLoading(true);
        setCatalogError(null);

        fetchL4d2CenterCatalog(installedMaps)
            .then((entries) => {
                setL4d2centerOptions(entries);
            })
            .catch((error: Error) => {
                const message = `${mapsTranslations.installL4d2CenterLoadFailed}: ${error.message}`;
                setCatalogError(message);
                setL4d2centerOptions([]);
                notificationManager.ERROR(message);
            })
            .finally(() => {
                setCatalogLoading(false);
            });
    }, [isDialogVisible, installedMaps, mapsTranslations.installL4d2CenterLoadFailed]);

    const handleHide = () => {
        if (isSubmitting) {
            return;
        }
        setDialogVisibility(false);
    };

    const installBlocked =
        mode === 'l4d2center' && (catalogLoading || Boolean(catalogError));

    const footer = (
        <div className="maps-install-dialog__footer-actions">
            <Button
                label={commonTranslations.cancel}
                className="maps-install-dialog__btn maps-install-dialog__btn-cancel app-focus-ring"
                onClick={handleHide}
                disabled={isSubmitting}
            />
            <Button
                label={
                    isSubmitting
                        ? mapsTranslations.installInProgress
                        : commonTranslations.save
                }
                className="maps-install-dialog__btn maps-install-dialog__btn-save app-focus-ring"
                disabled={isSubmitting || installBlocked}
                onClick={() => {
                    const payload = buildInstallPayload(mode, input, nameOverride);
                    const validationKey = validateInstallPayload(payload, { catalogNames });
                    if (validationKey) {
                        notificationManager.ERROR(mapsTranslations.installValidationError(validationKey));
                        return;
                    }

                    setIsSubmitting(true);
                    installMap(payload)
                        .then(() => {
                            notificationManager.SUCCESS(mapsTranslations.installSuccess);
                            setDialogVisibility(false);
                            resetForm();
                            onInstalled();
                        })
                        .catch((error: Error) => {
                            notificationManager.ERROR(
                                `${mapsTranslations.installFailed}: ${error.message}`
                            );
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }}
            />
        </div>
    );

    return (
        <Dialog
            visible={isDialogVisible}
            header={mapsTranslations.addMap}
            modal
            className="p-fluid app-dialog maps-install-dialog"
            headerClassName="maps-install-dialog__header"
            contentClassName="maps-install-dialog__content"
            maskClassName="maps-install-dialog__mask"
            style={DIALOG_STYLES}
            footer={footer}
            onHide={handleHide}
        >
            <DialogAddMapContent
                mode={mode}
                setMode={setMode}
                input={input}
                setInput={setInput}
                nameOverride={nameOverride}
                setNameOverride={setNameOverride}
                l4d2centerOptions={l4d2centerOptions}
                catalogLoading={catalogLoading}
                catalogError={catalogError}
                mapsTranslations={mapsTranslations}
            />
        </Dialog>
    );
}
