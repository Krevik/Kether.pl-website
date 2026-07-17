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
import { ManageMapDialog } from './Dialogues/ManageMapDialog';
import { MapUpdatesDetailsDialog } from './Dialogues/MapUpdatesDetailsDialog';
import {
    fetchMapUpdatesStatus,
    MapUpdatesStatus,
} from '../../services/mapsManageService';

const MAP_NAME_SEARCH_DEBOUNCE_MS = 280;
const MAP_UPDATES_POLL_MS = 10_000;

const EMPTY_UPDATES_STATUS: MapUpdatesStatus = {
    available: [],
    inProgress: [],
};

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
    const [manageMapId, setManageMapId] = useState<number | null>(null);
    const [manageDialogVisible, setManageDialogVisible] = useState(false);
    const [updatesStatus, setUpdatesStatus] = useState<MapUpdatesStatus>(EMPTY_UPDATES_STATUS);
    const [updatesDialogVisible, setUpdatesDialogVisible] = useState(false);
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

    const reloadUpdatesStatus = useCallback(() => {
        if (!isAdmin) return Promise.resolve();
        return fetchMapUpdatesStatus()
            .then((status) => {
                setUpdatesStatus(status);
            })
            .catch(() => {
                /* keep last known status */
            });
    }, [isAdmin]);

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

    useEffect(() => {
        if (!isAdmin) {
            setUpdatesStatus(EMPTY_UPDATES_STATUS);
            return;
        }

        let cancelled = false;
        const load = () => {
            fetchMapUpdatesStatus()
                .then((status) => {
                    if (!cancelled) setUpdatesStatus(status);
                })
                .catch(() => {
                    /* ignore poll errors */
                });
        };

        load();
        const timer = window.setInterval(load, MAP_UPDATES_POLL_MS);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [isAdmin]);

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
    const handleManageMap = useCallback((id: number) => {
        setManageMapId(id);
        setManageDialogVisible(true);
    }, []);
    const handleCloseManageDialog = useCallback(() => {
        setManageDialogVisible(false);
        setManageMapId(null);
    }, []);

    const handleMapsChanged = useCallback(() => {
        void reloadMaps();
        void reloadUpdatesStatus();
    }, [reloadMaps, reloadUpdatesStatus]);

    const inProgressCount = updatesStatus.inProgress.length;
    const availableCount = updatesStatus.available.length;
    const updatesStatusText =
        inProgressCount > 0
            ? mapsTranslations.updatesInProgressStatus(inProgressCount)
            : availableCount > 0
              ? mapsTranslations.updatesAvailableStatus(availableCount)
              : mapsTranslations.updatesNone;
    const showUpdatesDetailsLink = inProgressCount > 0 || availableCount > 0;

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
                        <div className="maps-admin-toolbar-wrap">
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
                            <div className="maps-admin-updates-status" role="status">
                                <span>{updatesStatusText}</span>
                                {showUpdatesDetailsLink && (
                                    <>
                                        {' '}
                                            <button
                                                type="button"
                                                className="maps-admin-updates__details-btn app-focus-ring"
                                                onClick={() => {
                                                    void reloadUpdatesStatus();
                                                    setUpdatesDialogVisible(true);
                                                }}
                                            >
                                            {mapsTranslations.updatesShowDetails}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <AddNewMapDialog
                        isDialogVisible={addMapDialogVisible}
                        setDialogVisibility={setAddMapDialogVisible}
                        onInstalled={handleMapsChanged}
                        installedMaps={maps}
                    />
                    <ManageMapDialog
                        isDialogVisible={manageDialogVisible}
                        mapId={manageMapId}
                        onHide={handleCloseManageDialog}
                        onRemoved={handleMapsChanged}
                        onUpdated={handleMapsChanged}
                    />
                    <MapUpdatesDetailsDialog
                        visible={updatesDialogVisible}
                        status={updatesStatus}
                        onHide={() => setUpdatesDialogVisible(false)}
                        onChanged={() => {
                            void reloadUpdatesStatus();
                            void reloadMaps();
                        }}
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
                                    isAdmin={isAdmin}
                                    onManage={handleManageMap}
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
                                    onManage={handleManageMap}
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
                                    onManage={handleManageMap}
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
                                    onManage={handleManageMap}
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
