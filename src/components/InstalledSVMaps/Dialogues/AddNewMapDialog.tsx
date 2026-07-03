import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DialogAddMapContent } from './DialogAddMapContent';
import {
    buildInstallPayload,
    InstallSourceMode,
    validateInstallPayload,
} from '../installMapUtils';
import { installMap } from '../../../services/mapsAdminService';
import { notificationManager } from '../../../utils/notificationManager';
import { useCommonTranslations, useMapsTranslations } from '../../../hooks/useTranslations';

export type AddNewMapDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    onInstalled: () => void;
};

export function AddNewMapDialog({
    isDialogVisible,
    setDialogVisibility,
    onInstalled,
}: AddNewMapDialogProps) {
    const mapsTranslations = useMapsTranslations();
    const commonTranslations = useCommonTranslations();
    const [mode, setMode] = useState<InstallSourceMode>('auto');
    const [input, setInput] = useState('');
    const [nameOverride, setNameOverride] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setMode('auto');
        setInput('');
        setNameOverride('');
    };

    const handleHide = () => {
        if (isSubmitting) {
            return;
        }
        setDialogVisibility(false);
    };

    const footer = (
        <>
            <Button
                label={`❌ ${commonTranslations.cancel}`}
                className="p-button-text app-focus-ring"
                onClick={handleHide}
                disabled={isSubmitting}
            />
            <Button
                label={
                    isSubmitting
                        ? mapsTranslations.installInProgress
                        : `✅ ${commonTranslations.save}`
                }
                className="p-button-text app-focus-ring"
                disabled={isSubmitting}
                onClick={() => {
                    const payload = buildInstallPayload(mode, input, nameOverride);
                    const validationKey = validateInstallPayload(payload);
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
        </>
    );

    return (
        <Dialog
            visible={isDialogVisible}
            header={mapsTranslations.addMap}
            modal
            className="p-fluid app-dialog"
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
                mapsTranslations={mapsTranslations}
            />
        </Dialog>
    );
}
