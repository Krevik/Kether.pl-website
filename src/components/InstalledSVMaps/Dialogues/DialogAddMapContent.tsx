import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { InstallSourceMode } from '../installMapUtils';
import { L4d2CenterCatalogOption } from '../l4d2centerCatalog';
import { useMapsTranslations } from '../../../hooks/useTranslations';

type MapsTranslations = ReturnType<typeof useMapsTranslations>;

export type DialogAddMapContentProps = {
    mode: InstallSourceMode;
    setMode: (mode: InstallSourceMode) => void;
    input: string;
    setInput: (value: string) => void;
    nameOverride: string;
    setNameOverride: (value: string) => void;
    l4d2centerOptions: L4d2CenterCatalogOption[];
    catalogLoading: boolean;
    catalogError: string | null;
    mapsTranslations: MapsTranslations;
};

export function DialogAddMapContent({
    mode,
    setMode,
    input,
    setInput,
    nameOverride,
    setNameOverride,
    l4d2centerOptions,
    catalogLoading,
    catalogError,
    mapsTranslations,
}: DialogAddMapContentProps) {
    const sourceOptions: { label: string; value: InstallSourceMode }[] = [
        { label: mapsTranslations.installSourceAuto, value: 'auto' },
        { label: mapsTranslations.installSourceWorkshop, value: 'workshop' },
        { label: mapsTranslations.installSourceL4d2Center, value: 'l4d2center' },
    ];

    const inputLabel = mapsTranslations.installInputLabel(mode);
    const inputPlaceholder = mapsTranslations.installInputPlaceholder(mode);
    const inputHint =
        mode === 'l4d2center' && catalogError
            ? catalogError
            : mode === 'l4d2center' && catalogLoading
              ? mapsTranslations.installL4d2CenterLoading
              : mapsTranslations.installInputHint(mode);

    const l4d2centerItemTemplate = (option: L4d2CenterCatalogOption) => (
        <span>
            {option.name}
            {option.installed ? ` ${mapsTranslations.installL4d2CenterAlreadyInstalled}` : ''}
        </span>
    );

    return (
        <div className="maps-install-form">
            <div className="maps-install-field">
                <label className="maps-install-label">{mapsTranslations.installSourceLabel}</label>
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
                <label className="maps-install-label">{inputLabel}</label>
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
                        placeholder={inputPlaceholder}
                    />
                )}
                <p
                    className={`maps-install-hint${catalogError && mode === 'l4d2center' ? ' maps-install-hint-error' : ''}`}
                >
                    {inputHint}
                </p>
            </div>

            <div className="maps-install-field">
                <label className="maps-install-label">{mapsTranslations.installNameOverride}</label>
                <InputText
                    className="maps-install-input app-focus-ring"
                    value={nameOverride}
                    onChange={(event) => setNameOverride(event.target.value)}
                    placeholder={mapsTranslations.installNameOverrideHint}
                />
            </div>
        </div>
    );
}
