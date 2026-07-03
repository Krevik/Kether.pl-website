import { useCallback, useEffect, useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import './InstalledSVMaps.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { useMapsTranslations } from '../../hooks/useTranslations';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { MAP_SOURCES, SIR_PLEASE_ALL_MAPS_URL } from './constants';
import {
    processMapsWithTranslations,
    filterMapsBySource,
    filterMapsByNameQuery,
} from './utils';
import { InstallationHelpDialog } from './InstallationHelpDialog';
import { WorkshopMapsGrid } from './WorkshopMapsGrid';
import { DownloadMapsList } from './DownloadMapsList';
import { fetchInstalledMaps } from '../../services/mapsService';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { MapEntry } from './mapEntry';
import { AddNewMapDialog } from './Dialogues/AddNewMapDialog';

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
    const [maps, setMaps] = useState<MapEntry[]>([]);
    const [mapsStale, setMapsStale] = useState(false);
    const [mapsLoading, setMapsLoading] = useState(true);
    const [addMapDialogVisible, setAddMapDialogVisible] = useState(false);
    const debouncedMapSearch = useDebouncedValue(mapSearch, MAP_NAME_SEARCH_DEBOUNCE_MS);

    const reloadMaps = useCallback(() => {
        setMapsLoading(true);
        return fetchInstalledMaps()
            .then((result) => {
                setMaps(result.maps);
                setMapsStale(result.stale);
            })
            .finally(() => {
                setMapsLoading(false);
            });
    }, []);

    useEffect(() => {
        let cancelled = false;

        fetchInstalledMaps().then((result) => {
            if (cancelled) return;
            setMaps(result.maps);
            setMapsStale(result.stale);
            setMapsLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const processedMaps = useMemo(
        () => processMapsWithTranslations(maps, mapsTranslations.allMaps),
        [maps, mapsTranslations.allMaps]
    );

    const workshopMaps = filterMapsBySource(processedMaps, MAP_SOURCES.WORKSHOP);

    const sirPleaseBundle = useMemo(
        () => ({
            mapName: mapsTranslations.allMaps,
            source: MAP_SOURCES.SIR_PLEASE,
            downloadUrl: SIR_PLEASE_ALL_MAPS_URL,
        }),
        [mapsTranslations.allMaps]
    );

    const sirPleaseMaps = useMemo(() => {
        const fromApi = filterMapsBySource(processedMaps, MAP_SOURCES.SIR_PLEASE).filter(
            (map) => map.downloadUrl !== SIR_PLEASE_ALL_MAPS_URL
        );
        return [sirPleaseBundle, ...fromApi];
    }, [processedMaps, sirPleaseBundle]);

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

    if (mapsLoading) {
        return (
            <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
                <div className="installed-sv-maps">
                    <LoadingSpinner type="skeleton" minDelay={50} />
                </div>
            </PageWithBackground>
        );
    }

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="installed-sv-maps">
                <div className="card app-surface app-page-card">
                    <div className="centered-text">{mapsTranslations.title}</div>

                    {isAdmin && (
                        <Toolbar
                            className="maps-admin-toolbar app-toolbar"
                            start={
                                <Button
                                    label={`➕ ${mapsTranslations.addMap}`}
                                    className="p-button-success mr-2 app-focus-ring"
                                    title={mapsTranslations.addMapTooltip}
                                    onClick={() => setAddMapDialogVisible(true)}
                                />
                            }
                        />
                    )}

                    <AddNewMapDialog
                        isDialogVisible={addMapDialogVisible}
                        setDialogVisibility={setAddMapDialogVisible}
                        onInstalled={reloadMaps}
                        installedMaps={maps}
                    />

                    {mapsStale && (
                        <div className="maps-stale-banner" role="status">
                            {mapsTranslations.staleListNotice}
                        </div>
                    )}

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
                                <DownloadMapsList
                                    maps={filteredSirPleaseMaps}
                                    isAdmin={isAdmin}
                                    mapsTranslations={mapsTranslations}
                                    onHelpClick={handleOpenHelpDialog}
                                    pinFirstDownloadUrl={SIR_PLEASE_ALL_MAPS_URL}
                                    emptyMessage={
                                        sirPleaseMaps.length === 0
                                            ? mapsTranslations.noMapsAvailable
                                            : tableEmptyMessage
                                    }
                                />
                            </div>
                        )}
                        {activeTab === 'l4d2center' && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabL4D2Center}
                            >
                                <DownloadMapsList
                                    maps={filteredL4D2CenterMaps}
                                    isAdmin={isAdmin}
                                    mapsTranslations={mapsTranslations}
                                    onHelpClick={handleOpenHelpDialog}
                                    emptyMessage={
                                        l4d2CenterMaps.length === 0
                                            ? mapsTranslations.noMapsAvailable
                                            : tableEmptyMessage
                                    }
                                />
                            </div>
                        )}
                        {activeTab === 'other' && otherMaps.length > 0 && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabOther}
                            >
                                <DownloadMapsList
                                    maps={filteredOtherMaps}
                                    isAdmin={isAdmin}
                                    mapsTranslations={mapsTranslations}
                                    onHelpClick={handleOpenHelpDialog}
                                    emptyMessage={tableEmptyMessage}
                                />
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
