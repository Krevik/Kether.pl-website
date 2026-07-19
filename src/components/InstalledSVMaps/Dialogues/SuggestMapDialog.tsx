import { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { DIALOG_STYLES } from '../constants';
import { fetchL4d2CenterCatalog, L4d2CenterCatalogOption } from '../l4d2centerCatalog';
import { MapEntry } from '../mapEntry';
import {
    createMapSuggestion,
    MapSuggestionSourceKind,
} from '../../../services/mapSuggestionsService';
import { notificationManager } from '../../../utils/notificationManager';
import { useCommonTranslations, useMapsTranslations } from '../../../hooks/useTranslations';

export type SuggestMapDialogProps = {
    isDialogVisible: boolean;
    setDialogVisibility: (visible: boolean) => void;
    onSuggested: () => void;
    installedMaps: MapEntry[];
};

export function SuggestMapDialog({
    isDialogVisible,
    setDialogVisibility,
    onSuggested,
    installedMaps,
}: SuggestMapDialogProps) {
    const mapsTranslations = useMapsTranslations();
    const commonTranslations = useCommonTranslations();
    const [mode, setMode] = useState<MapSuggestionSourceKind>('workshop');
    const [input, setInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [l4d2centerOptions, setL4d2centerOptions] = useState<L4d2CenterCatalogOption[]>([]);
    const [catalogLoading, setCatalogLoading] = useState(false);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    const resetForm = () => {
        setMode('workshop');
        setInput('');
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

    const sourceOptions = useMemo(
        () => [
            { label: mapsTranslations.installSourceWorkshop, value: 'workshop' as const },
            { label: mapsTranslations.installSourceL4d2Center, value: 'l4d2center' as const },
        ],
        [mapsTranslations.installSourceWorkshop, mapsTranslations.installSourceL4d2Center]
    );

    const handleHide = () => {
        if (isSubmitting) {
            return;
        }
        setDialogVisibility(false);
    };

    const submitBlocked =
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
                        ? mapsTranslations.suggestSubmitting
                        : mapsTranslations.suggestSubmit
                }
                className="maps-install-dialog__btn maps-install-dialog__btn-save app-focus-ring"
                disabled={isSubmitting || submitBlocked || !input.trim()}
                onClick={() => {
                    const trimmed = input.trim();
                    if (!trimmed) {
                        notificationManager.ERROR(
                            mapsTranslations.installValidationError('installInputRequired')
                        );
                        return;
                    }

                    setIsSubmitting(true);
                    createMapSuggestion({ mode, input: trimmed })
                        .then(() => {
                            notificationManager.SUCCESS(mapsTranslations.suggestSuccess);
                            setDialogVisibility(false);
                            resetForm();
                            onSuggested();
                        })
                        .catch((error: Error) => {
                            notificationManager.ERROR(
                                `${mapsTranslations.suggestFailed}: ${error.message}`
                            );
                        })
                        .finally(() => {
                            setIsSubmitting(false);
                        });
                }}
            />
        </div>
    );

    const l4d2centerItemTemplate = (option: L4d2CenterCatalogOption) => (
        <span>
            {option.name}
            {option.installed ? ` ${mapsTranslations.installL4d2CenterAlreadyInstalled}` : ''}
        </span>
    );

    return (
        <Dialog
            visible={isDialogVisible}
            header={mapsTranslations.suggestMap}
            modal
            className="p-fluid app-dialog maps-install-dialog"
            headerClassName="maps-install-dialog__header"
            contentClassName="maps-install-dialog__content"
            maskClassName="maps-install-dialog__mask"
            style={DIALOG_STYLES}
            footer={footer}
            onHide={handleHide}
        >
            <div className="maps-install-form">
                <div className="maps-install-field">
                    <label className="maps-install-label">
                        {mapsTranslations.installSourceLabel}
                    </label>
                    <SelectButton
                        value={mode}
                        options={sourceOptions}
                        onChange={(event) => {
                            if (event.value) {
                                setMode(event.value);
                                setInput('');
                            }
                        }}
                        className="maps-install-source-select app-focus-ring"
                    />
                </div>

                <div className="maps-install-field">
                    <label className="maps-install-label">
                        {mapsTranslations.installInputLabel(mode)}
                    </label>
                    {mode === 'l4d2center' ? (
                        <Dropdown
                            value={input || null}
                            options={l4d2centerOptions}
                            onChange={(event) => setInput(event.value ?? '')}
                            optionLabel="name"
                            optionValue="name"
                            optionDisabled={(option) => option.installed}
                            itemTemplate={l4d2centerItemTemplate}
                            placeholder={mapsTranslations.installL4d2CenterSelectPlaceholder}
                            disabled={catalogLoading || Boolean(catalogError)}
                            className="maps-install-l4d2center-dropdown maps-install-input app-focus-ring"
                            panelClassName="maps-install-l4d2center-dropdown-panel"
                            showClear
                        />
                    ) : (
                        <InputText
                            className="maps-install-input app-focus-ring"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder={mapsTranslations.installInputPlaceholder('workshop')}
                        />
                    )}
                    <p
                        className={`maps-install-hint${
                            catalogError && mode === 'l4d2center'
                                ? ' maps-install-hint-error'
                                : ''
                        }`}
                    >
                        {mode === 'l4d2center' && catalogError
                            ? catalogError
                            : mode === 'l4d2center' && catalogLoading
                              ? mapsTranslations.installL4d2CenterLoading
                              : mapsTranslations.installInputHint(mode)}
                    </p>
                </div>
            </div>
        </Dialog>
    );
}
