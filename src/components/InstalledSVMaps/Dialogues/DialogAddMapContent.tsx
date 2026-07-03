import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { InstallSourceMode } from '../installMapUtils';
import { useMapsTranslations } from '../../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type DialogAddMapContentProps = {
    mode: InstallSourceMode;
    setMode: (mode: InstallSourceMode) => void;
    input: string;
    setInput: (value: string) => void;
    nameOverride: string;
    setNameOverride: (value: string) => void;
    mapsTranslations: MapsTranslations;
};

export function DialogAddMapContent({
    mode,
    setMode,
    input,
    setInput,
    nameOverride,
    setNameOverride,
    mapsTranslations,
}: DialogAddMapContentProps) {
    const sourceOptions: { label: string; value: InstallSourceMode }[] = [
        { label: mapsTranslations.installSourceAuto, value: 'auto' },
        { label: mapsTranslations.installSourceWorkshop, value: 'workshop' },
        { label: mapsTranslations.installSourceSirPlease, value: 'sirplease' },
        { label: mapsTranslations.installSourceL4d2Center, value: 'l4d2center' },
    ];

    const inputLabel = mapsTranslations.installInputLabel(mode);
    const inputPlaceholder = mapsTranslations.installInputPlaceholder(mode);
    const inputHint = mapsTranslations.installInputHint(mode);

    return (
        <>
            <h5>{mapsTranslations.installSourceLabel}</h5>
            <SelectButton
                value={mode}
                options={sourceOptions}
                onChange={(event) => {
                    if (event.value) {
                        setMode(event.value);
                    }
                }}
                className="maps-install-source-select app-focus-ring"
            />

            <h5>{inputLabel}</h5>
            <InputText
                className="app-focus-ring"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={inputPlaceholder}
            />
            <p className="maps-install-hint">{inputHint}</p>

            <h5>{mapsTranslations.installNameOverride}</h5>
            <InputText
                className="app-focus-ring"
                value={nameOverride}
                onChange={(event) => setNameOverride(event.target.value)}
                placeholder={mapsTranslations.installNameOverrideHint}
            />
        </>
    );
}
