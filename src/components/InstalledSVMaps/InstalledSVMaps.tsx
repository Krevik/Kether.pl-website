import { useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import './InstalledSVMaps.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { useMapsTranslations } from '../../hooks/useTranslations';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { RAW_INSTALLED_MAPS } from './mapsData';
import { MAP_SOURCES } from './constants';
import {
    processMapsWithTranslations,
    filterMapsBySource,
    filterMapsByNameQuery,
} from './utils';
import { MapsDataTable } from './MapsDataTable';
import { InstallationHelpDialog } from './InstallationHelpDialog';
import { WorkshopMapsGrid } from './WorkshopMapsGrid';

const MAP_NAME_SEARCH_DEBOUNCE_MS = 280;

export type { MapEntry } from './mapEntry';

type MapsTabId = 'workshop' | 'sirplease' | 'l4d2center' | 'other';

export default function InstalledSVMaps() {
    const mapsTranslations = useMapsTranslations();
    const isAdmin = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    const [helpDialogVisible, setHelpDialogVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<MapsTabId>('workshop');
    const [mapSearch, setMapSearch] = useState('');
    const debouncedMapSearch = useDebouncedValue(mapSearch, MAP_NAME_SEARCH_DEBOUNCE_MS);

    // Process maps: replace translation placeholders and filter by source
    const processedMaps = processMapsWithTranslations(
        RAW_INSTALLED_MAPS,
        mapsTranslations.allMaps
    );
    
    const workshopMaps = filterMapsBySource(processedMaps, MAP_SOURCES.WORKSHOP);
    const sirPleaseMaps = filterMapsBySource(processedMaps, MAP_SOURCES.SIR_PLEASE);
    const l4d2CenterMaps = filterMapsBySource(processedMaps, MAP_SOURCES.L4D2CENTER);
    const otherMaps = filterMapsBySource(processedMaps, MAP_SOURCES.OTHER);

    const filteredWorkshopMaps = useMemo(
        () => filterMapsByNameQuery(workshopMaps, debouncedMapSearch),
        [workshopMaps, debouncedMapSearch]
    );
    const filteredSirPleaseMaps = useMemo(
        () => filterMapsByNameQuery(sirPleaseMaps, debouncedMapSearch),
        [sirPleaseMaps, debouncedMapSearch]
    );
    const filteredL4D2CenterMaps = useMemo(
        () => filterMapsByNameQuery(l4d2CenterMaps, debouncedMapSearch),
        [l4d2CenterMaps, debouncedMapSearch]
    );
    const filteredOtherMaps = useMemo(
        () => filterMapsByNameQuery(otherMaps, debouncedMapSearch),
        [otherMaps, debouncedMapSearch]
    );

    const workshopGridEmptyMessage = useMemo(() => {
        if (workshopMaps.length === 0) {
            return mapsTranslations.noMapsAvailable;
        }
        if (debouncedMapSearch.trim() && filteredWorkshopMaps.length === 0) {
            return mapsTranslations.searchNoResults;
        }
        return mapsTranslations.noMapsAvailable;
    }, [
        workshopMaps.length,
        debouncedMapSearch,
        filteredWorkshopMaps.length,
        mapsTranslations.noMapsAvailable,
        mapsTranslations.searchNoResults,
    ]);

    const tableEmptyMessage =
        debouncedMapSearch.trim().length > 0 ? mapsTranslations.searchNoResults : undefined;

    const tabIds = useMemo(() => {
        const ids: MapsTabId[] = ['workshop', 'sirplease', 'l4d2center'];
        if (otherMaps.length > 0) ids.push('other');
        return ids;
    }, [otherMaps.length]);

    const handleOpenHelpDialog = () => setHelpDialogVisible(true);
    const handleCloseHelpDialog = () => setHelpDialogVisible(false);

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="installed-sv-maps">
                <div className="card app-surface app-page-card">
                    <div className="centered-text">{mapsTranslations.title}</div>

                    <div className="maps-tabs" role="tablist" aria-label={mapsTranslations.mapsSections}>
                        {tabIds.includes('workshop') && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'workshop'}
                                className={`maps-tab app-focus-ring ${activeTab === 'workshop' ? 'maps-tab-active' : ''}`}
                                onClick={() => setActiveTab('workshop')}
                            >
                                {mapsTranslations.tabWorkshop}
                            </button>
                        )}
                        {tabIds.includes('sirplease') && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'sirplease'}
                                className={`maps-tab app-focus-ring ${activeTab === 'sirplease' ? 'maps-tab-active' : ''}`}
                                onClick={() => setActiveTab('sirplease')}
                            >
                                {mapsTranslations.tabSirPlease}
                            </button>
                        )}
                        {tabIds.includes('l4d2center') && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'l4d2center'}
                                className={`maps-tab app-focus-ring ${activeTab === 'l4d2center' ? 'maps-tab-active' : ''}`}
                                onClick={() => setActiveTab('l4d2center')}
                            >
                                {mapsTranslations.tabL4D2Center}
                            </button>
                        )}
                        {tabIds.includes('other') && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'other'}
                                className={`maps-tab app-focus-ring ${activeTab === 'other' ? 'maps-tab-active' : ''}`}
                                onClick={() => setActiveTab('other')}
                            >
                                {mapsTranslations.tabOther}
                            </button>
                        )}
                    </div>

                    <div className="maps-search-row">
                        <label className="maps-search-label" htmlFor="maps-name-search">
                            {mapsTranslations.searchLabel}
                        </label>
                        <InputText
                            id="maps-name-search"
                            type="search"
                            value={mapSearch}
                            onChange={(e) => setMapSearch(e.target.value)}
                            placeholder={mapsTranslations.searchPlaceholder}
                            className="maps-search-input app-focus-ring"
                            autoComplete="off"
                            spellCheck={false}
                            aria-busy={mapSearch !== debouncedMapSearch}
                        />
                    </div>

                    <div className="maps-tab-panels">
                        {activeTab === 'workshop' && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabWorkshop}
                            >
                                <WorkshopMapsGrid
                                    maps={filteredWorkshopMaps}
                                    mapsTranslations={mapsTranslations}
                                    zeroStateMessage={workshopGridEmptyMessage}
                                />
                            </div>
                        )}
                        {activeTab === 'sirplease' && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabSirPlease}
                            >
                                <div className="tables-container maps-tab-panel-inner">
                                    {sirPleaseMaps.length === 0 ? (
                                        <p className="maps-empty">{mapsTranslations.noMapsAvailable}</p>
                                    ) : (
                                        <MapsDataTable
                                            maps={filteredSirPleaseMaps}
                                            title={mapsTranslations.tabSirPlease}
                                            isAdmin={isAdmin}
                                            mapsTranslations={mapsTranslations}
                                            onHelpClick={handleOpenHelpDialog}
                                            hideTitle
                                            emptyMessage={tableEmptyMessage}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'l4d2center' && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabL4D2Center}
                            >
                                <div className="tables-container maps-tab-panel-inner">
                                    <MapsDataTable
                                        maps={filteredL4D2CenterMaps}
                                        title={mapsTranslations.tabL4D2Center}
                                        isAdmin={isAdmin}
                                        mapsTranslations={mapsTranslations}
                                        onHelpClick={handleOpenHelpDialog}
                                        hideTitle
                                        emptyMessage={tableEmptyMessage}
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === 'other' && otherMaps.length > 0 && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabOther}
                            >
                                <div className="tables-container maps-tab-panel-inner">
                                    <MapsDataTable
                                        maps={filteredOtherMaps}
                                        title={mapsTranslations.tabOther}
                                        isAdmin={isAdmin}
                                        mapsTranslations={mapsTranslations}
                                        onHelpClick={handleOpenHelpDialog}
                                        hideTitle
                                        emptyMessage={tableEmptyMessage}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <InstallationHelpDialog
                visible={helpDialogVisible}
                onHide={handleCloseHelpDialog}
            />
        </PageWithBackground>
    );
}
