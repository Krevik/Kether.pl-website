import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { ProgressBar } from 'primereact/progressbar';
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
import { SuggestMapDialog } from './Dialogues/SuggestMapDialog';
import { ManageMapDialog } from './Dialogues/ManageMapDialog';
import { MapUpdatesDetailsDialog } from './Dialogues/MapUpdatesDetailsDialog';
import { MapSuggestionCard } from './MapSuggestionCard';
import {
    checkMapUpdates,
    fetchMapUpdatesStatus,
    MapUpdateItem,
    MapUpdatesStatus,
} from '../../services/mapsManageService';
import {
    acceptMapSuggestion,
    denyMapSuggestion,
    fetchMapSuggestions,
    MapSuggestion,
} from '../../services/mapSuggestionsService';

import { notificationManager } from '../../utils/notificationManager';

const MAP_NAME_SEARCH_DEBOUNCE_MS = 280;
const MAP_UPDATES_POLL_IDLE_MS = 10_000;
const MAP_UPDATES_POLL_ACTIVE_MS = 1_000;

const EMPTY_UPDATES_STATUS: MapUpdatesStatus = {
    available: [],
    inProgress: [],
};

export type { MapEntry } from './mapEntry';

type MapsTabId = 'workshop' | 'sirplease' | 'l4d2center' | 'other' | 'suggestions';

function visibleAvailable(status: MapUpdatesStatus) {
    const inProgressIds = new Set(status.inProgress.map((item) => item.mapId));
    return status.available.filter((item) => !inProgressIds.has(item.mapId));
}

/** Prefer daemon in-progress rows; keep optimistic only while still pending/active. */
function mergeUpdatesStatus(
    prev: MapUpdatesStatus,
    next: MapUpdatesStatus,
    keepOptimistic: boolean
): MapUpdatesStatus {
    if (!keepOptimistic || prev.inProgress.length === 0) {
        return next;
    }

    const daemonInProgressIds = new Set(next.inProgress.map((item) => item.mapId));
    const stillAvailableIds = new Set(next.available.map((item) => item.mapId));
    const mergedInProgress: MapUpdateItem[] = [];
    const seen = new Set<number>();

    for (const item of next.inProgress) {
        mergedInProgress.push(item);
        seen.add(item.mapId);
    }
    for (const item of prev.inProgress) {
        if (seen.has(item.mapId)) continue;
        // Keep optimistic only if still available (not yet started on daemon)
        // or already reported in-progress. Drop when absent from both (finished).
        if (stillAvailableIds.has(item.mapId) || daemonInProgressIds.has(item.mapId)) {
            mergedInProgress.push(item);
            seen.add(item.mapId);
        }
    }

    return {
        available: next.available.filter((item) => !seen.has(item.mapId)),
        inProgress: mergedInProgress,
    };
}

export default function InstalledSVMaps() {
    const mapsTranslations = useMapsTranslations();
    const isAdmin = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    const userID = useSelector((state: AppState) => state.userDataReducer.userID);
    const [helpDialogVisible, setHelpDialogVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<MapsTabId>('workshop');
    const [mapSearch, setMapSearch] = useState('');
    const [maps, setMaps] = useState<MapEntry[]>([]);
    const [mapsStale, setMapsStale] = useState(false);
    const [mapsLoading, setMapsLoading] = useState(true);
    const [addMapDialogVisible, setAddMapDialogVisible] = useState(false);
    const [suggestMapDialogVisible, setSuggestMapDialogVisible] = useState(false);
    const [suggestions, setSuggestions] = useState<MapSuggestion[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [acceptingSuggestionId, setAcceptingSuggestionId] = useState<number | null>(null);
    const [denyingSuggestionId, setDenyingSuggestionId] = useState<number | null>(null);
    const [manageMapId, setManageMapId] = useState<number | null>(null);
    const [manageDialogVisible, setManageDialogVisible] = useState(false);
    const [updatesStatus, setUpdatesStatus] = useState<MapUpdatesStatus>(EMPTY_UPDATES_STATUS);
    const [updatesDialogVisible, setUpdatesDialogVisible] = useState(false);
    const [forceFastUpdatesPoll, setForceFastUpdatesPoll] = useState(false);
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
    const updatesStatusGeneration = useRef(0);
    const forceFastUpdatesPollRef = useRef(false);
    const checkingRef = useRef(false);
    const isCheckingUpdatesRef = useRef(false);
    forceFastUpdatesPollRef.current = forceFastUpdatesPoll;
    isCheckingUpdatesRef.current = isCheckingUpdates;
    const debouncedMapSearch = useDebouncedValue(mapSearch, MAP_NAME_SEARCH_DEBOUNCE_MS);

    const reloadMaps = useCallback((options?: { soft?: boolean }) => {
        const soft = options?.soft ?? true;
        if (!soft) {
            setMapsLoading(true);
        }
        return fetchInstalledMaps()
            .then((result) => {
                setMaps(result.maps);
                setMapsStale(result.stale);
            })
            .finally(() => {
                if (!soft) {
                    setMapsLoading(false);
                }
            });
    }, []);

    const reloadSuggestions = useCallback(() => {
        setSuggestionsLoading(true);
        return fetchMapSuggestions()
            .then((items) => {
                setSuggestions(items);
            })
            .catch((error: Error) => {
                notificationManager.ERROR(
                    `${mapsTranslations.suggestLoadFailed}: ${error.message}`
                );
            })
            .finally(() => {
                setSuggestionsLoading(false);
            });
    }, [mapsTranslations.suggestLoadFailed]);

    const reloadUpdatesStatus = useCallback(() => {
        if (!isAdmin) return Promise.resolve();
        const generation = ++updatesStatusGeneration.current;
        return fetchMapUpdatesStatus()
            .then((status) => {
                if (generation !== updatesStatusGeneration.current) return;
                setUpdatesStatus((prev) =>
                    mergeUpdatesStatus(prev, status, forceFastUpdatesPollRef.current)
                );
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
        void reloadSuggestions();
    }, [reloadSuggestions]);

    useEffect(() => {
        if (!isAdmin) {
            setUpdatesStatus(EMPTY_UPDATES_STATUS);
            return;
        }
        if (isCheckingUpdates) {
            return;
        }

        let cancelled = false;
        const load = () => {
            if (isCheckingUpdatesRef.current) return;
            const generation = ++updatesStatusGeneration.current;
            fetchMapUpdatesStatus()
                .then((status) => {
                    if (!cancelled && generation === updatesStatusGeneration.current) {
                        setUpdatesStatus((prev) =>
                            mergeUpdatesStatus(
                                prev,
                                status,
                                forceFastUpdatesPollRef.current
                            )
                        );
                    }
                })
                .catch(() => {
                    /* ignore poll errors */
                });
        };

        load();
        const pollMs =
            updatesStatus.inProgress.length > 0 || forceFastUpdatesPoll
                ? MAP_UPDATES_POLL_ACTIVE_MS
                : MAP_UPDATES_POLL_IDLE_MS;
        const timer = window.setInterval(load, pollMs);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [isAdmin, updatesStatus.inProgress.length, forceFastUpdatesPoll, isCheckingUpdates]);

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
        const ids: MapsTabId[] = ['workshop', 'sirplease', 'l4d2center', 'suggestions'];
        if (otherMaps.length > 0) ids.push('other');
        return ids;
    }, [otherMaps.length]);

    const filteredSuggestions = useMemo(() => {
        const query = debouncedMapSearch.trim().toLowerCase();
        if (!query) return suggestions;
        return suggestions.filter((item) => item.title.toLowerCase().includes(query));
    }, [suggestions, debouncedMapSearch]);

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
        return Promise.all([
            reloadMaps({ soft: true }),
            reloadUpdatesStatus(),
            reloadSuggestions(),
        ]).then(() => undefined);
    }, [reloadMaps, reloadUpdatesStatus, reloadSuggestions]);

    const handleAcceptSuggestion = useCallback(
        async (id: number) => {
            setAcceptingSuggestionId(id);
            try {
                await acceptMapSuggestion(id);
                notificationManager.SUCCESS(mapsTranslations.suggestAcceptSuccess);
                await handleMapsChanged();
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                notificationManager.ERROR(
                    `${mapsTranslations.suggestAcceptFailed}: ${message}`
                );
            } finally {
                setAcceptingSuggestionId(null);
            }
        },
        [
            handleMapsChanged,
            mapsTranslations.suggestAcceptFailed,
            mapsTranslations.suggestAcceptSuccess,
        ]
    );

    const handleDenySuggestion = useCallback(
        async (id: number) => {
            setDenyingSuggestionId(id);
            try {
                await denyMapSuggestion(id);
                notificationManager.SUCCESS(mapsTranslations.suggestDenySuccess);
                await reloadSuggestions();
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                notificationManager.ERROR(
                    `${mapsTranslations.suggestDenyFailed}: ${message}`
                );
            } finally {
                setDenyingSuggestionId(null);
            }
        },
        [
            mapsTranslations.suggestDenyFailed,
            mapsTranslations.suggestDenySuccess,
            reloadSuggestions,
        ]
    );

    const handleUpdatesApplyStarted = useCallback((items: MapUpdateItem[]) => {
        if (items.length === 0) return;
        forceFastUpdatesPollRef.current = true;
        setForceFastUpdatesPoll(true);
        setUpdatesStatus((prev) => {
            const startedIds = new Set(items.map((item) => item.mapId));
            const retained = prev.inProgress.filter((item) => !startedIds.has(item.mapId));
            const optimistic = items.map((item) => ({
                ...item,
                phase: item.phase ?? ('downloading' as const),
                bytesDownloaded: item.bytesDownloaded ?? 0,
            }));
            return {
                available: prev.available.filter((item) => !startedIds.has(item.mapId)),
                inProgress: [...retained, ...optimistic],
            };
        });
        void reloadUpdatesStatus();
    }, [reloadUpdatesStatus]);

    const handleUpdatesApplyFinished = useCallback(() => {
        forceFastUpdatesPollRef.current = false;
        setForceFastUpdatesPoll(false);
        return handleMapsChanged();
    }, [handleMapsChanged]);

    const handleCheckUpdates = async () => {
        if (checkingRef.current) return;
        checkingRef.current = true;
        setIsCheckingUpdates(true);
        isCheckingUpdatesRef.current = true;
        // Invalidate in-flight polls so they cannot overwrite the check result.
        ++updatesStatusGeneration.current;
        try {
            const status = await checkMapUpdates();
            ++updatesStatusGeneration.current;
            setUpdatesStatus((prev) =>
                mergeUpdatesStatus(prev, status, forceFastUpdatesPollRef.current)
            );
            const availableCount = visibleAvailable(status).length;
            if (availableCount > 0) {
                notificationManager.SUCCESS(mapsTranslations.updatesCheckFound(availableCount));
                setUpdatesDialogVisible(true);
            } else {
                notificationManager.SUCCESS(mapsTranslations.updatesCheckNone);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            notificationManager.ERROR(`${mapsTranslations.updatesCheckFailed}: ${message}`);
        } finally {
            checkingRef.current = false;
            isCheckingUpdatesRef.current = false;
            setIsCheckingUpdates(false);
        }
    };

    const handleManageUpdated = useCallback(
        (options?: { reloadMaps?: boolean }) => {
            forceFastUpdatesPollRef.current = false;
            setForceFastUpdatesPoll(false);
            const tasks: Promise<unknown>[] = [reloadUpdatesStatus()];
            if (options?.reloadMaps) {
                tasks.push(reloadMaps({ soft: true }));
            }
            return Promise.all(tasks).then(() => undefined);
        },
        [reloadMaps, reloadUpdatesStatus]
    );

    const availableVisible = useMemo(
        () => visibleAvailable(updatesStatus),
        [updatesStatus]
    );
    const dialogStatus = useMemo(
        () => ({
            available: availableVisible,
            inProgress: updatesStatus.inProgress,
        }),
        [availableVisible, updatesStatus.inProgress]
    );

    const inProgressCount = updatesStatus.inProgress.length;
    const availableCount = availableVisible.length;
    const primaryInProgress = updatesStatus.inProgress[0];
    const updatesStatusText =
        inProgressCount > 0 && primaryInProgress
            ? inProgressCount === 1
                ? mapsTranslations.updatesPhaseLabel(primaryInProgress)
                : mapsTranslations.updatesInProgressStatus(inProgressCount)
            : availableCount > 0
              ? mapsTranslations.updatesAvailableStatus(availableCount)
              : mapsTranslations.updatesNone;
    const showUpdatesDetailsLink = inProgressCount > 0 || availableCount > 0;
    const progressPercent =
        inProgressCount === 1 && typeof primaryInProgress?.percent === 'number'
            ? primaryInProgress.percent
            : null;
    const showProgressBar = inProgressCount > 0;

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

                    {(isAdmin || userID) && (
                        <Toolbar
                            className="mb-4 maps-admin-toolbar app-toolbar"
                            start={
                                <>
                                    {isAdmin && (
                                        <Button
                                            label={`➕ ${mapsTranslations.addMap}`}
                                            className="p-button-success mr-2 app-focus-ring"
                                            title={mapsTranslations.addMapTooltip}
                                            onClick={() => setAddMapDialogVisible(true)}
                                        />
                                    )}
                                    {userID && (
                                        <Button
                                            label={`💡 ${mapsTranslations.suggestMap}`}
                                            className="p-button-secondary mr-2 app-focus-ring"
                                            title={mapsTranslations.suggestMapTooltip}
                                            onClick={() => setSuggestMapDialogVisible(true)}
                                        />
                                    )}
                                    {isAdmin && (
                                        <Button
                                            label={
                                                isCheckingUpdates
                                                    ? mapsTranslations.updatesCheckInProgress
                                                    : mapsTranslations.updatesCheck
                                            }
                                            icon={
                                                isCheckingUpdates
                                                    ? 'pi pi-spin pi-spinner'
                                                    : 'pi pi-refresh'
                                            }
                                            className="p-button-secondary app-focus-ring"
                                            onClick={() => void handleCheckUpdates()}
                                            disabled={isCheckingUpdates}
                                        />
                                    )}
                                </>
                            }
                            end={
                                isAdmin ? (
                                    <div className="maps-admin-updates-cluster">
                                        <div className="maps-admin-updates-status" role="status">
                                            <span>{updatesStatusText}</span>
                                            {showProgressBar && (
                                                <ProgressBar
                                                    className="maps-admin-updates-progress"
                                                    value={progressPercent ?? undefined}
                                                    mode={
                                                        progressPercent === null
                                                            ? 'indeterminate'
                                                            : 'determinate'
                                                    }
                                                    showValue={false}
                                                    aria-label={updatesStatusText}
                                                />
                                            )}
                                        </div>
                                        {showUpdatesDetailsLink && (
                                            <button
                                                type="button"
                                                className="maps-admin-updates__details-btn app-focus-ring"
                                                aria-haspopup="dialog"
                                                aria-expanded={updatesDialogVisible}
                                                onClick={() => {
                                                    void reloadUpdatesStatus();
                                                    setUpdatesDialogVisible(true);
                                                }}
                                            >
                                                {mapsTranslations.updatesShowDetails}
                                            </button>
                                        )}
                                    </div>
                                ) : undefined
                            }
                        />
                    )}

                    <AddNewMapDialog
                        isDialogVisible={addMapDialogVisible}
                        setDialogVisibility={setAddMapDialogVisible}
                        onInstalled={handleMapsChanged}
                        installedMaps={maps}
                    />
                    <SuggestMapDialog
                        isDialogVisible={suggestMapDialogVisible}
                        setDialogVisibility={setSuggestMapDialogVisible}
                        onSuggested={() => void reloadSuggestions()}
                        installedMaps={maps}
                    />
                    <ManageMapDialog
                        isDialogVisible={manageDialogVisible}
                        mapId={manageMapId}
                        onHide={handleCloseManageDialog}
                        onRemoved={handleMapsChanged}
                        onUpdated={handleManageUpdated}
                        onUpdateStarted={(item) =>
                            handleUpdatesApplyStarted([
                                {
                                    name: item.name,
                                    mapId: item.mapId,
                                    sourceKind: item.sourceKind,
                                    phase: 'downloading',
                                    bytesDownloaded: 0,
                                },
                            ])
                        }
                    />
                    <MapUpdatesDetailsDialog
                        visible={updatesDialogVisible}
                        status={dialogStatus}
                        onHide={() => setUpdatesDialogVisible(false)}
                        onChanged={handleMapsChanged}
                        onApplyStarted={handleUpdatesApplyStarted}
                        onApplyFinished={handleUpdatesApplyFinished}
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
                        {tabIds.includes('suggestions') && (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'suggestions'}
                                className={`maps-tab app-focus-ring ${activeTab === 'suggestions' ? 'maps-tab-active' : ''}`}
                                onClick={() => setActiveTab('suggestions')}
                            >
                                {mapsTranslations.tabSuggestions}
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
                        {activeTab === 'suggestions' && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabSuggestions}
                            >
                                {suggestionsLoading ? (
                                    <LoadingSpinner />
                                ) : filteredSuggestions.length === 0 ? (
                                    <div className="maps-empty">
                                        {suggestions.length === 0
                                            ? mapsTranslations.suggestNone
                                            : mapsTranslations.searchNoResults}
                                    </div>
                                ) : (
                                    <div className="workshop-maps-section">
                                        <div className="workshop-maps-grid">
                                            {filteredSuggestions.map((item, index) => (
                                                <MapSuggestionCard
                                                    key={item.id}
                                                    suggestion={item}
                                                    mapsTranslations={mapsTranslations}
                                                    isAdmin={isAdmin}
                                                    acceptingId={acceptingSuggestionId}
                                                    denyingId={denyingSuggestionId}
                                                    onAccept={(id) => void handleAcceptSuggestion(id)}
                                                    onDeny={(id) => void handleDenySuggestion(id)}
                                                    style={{
                                                        animationDelay: `${Math.min(index, 24) * 35}ms`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
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
