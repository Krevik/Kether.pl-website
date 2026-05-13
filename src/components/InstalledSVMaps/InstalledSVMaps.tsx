import { useMemo, useState } from 'react';
import './InstalledSVMaps.css';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { useMapsTranslations } from '../../hooks/useTranslations';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';
import { RAW_INSTALLED_MAPS } from './mapsData';
import { MAP_SOURCES } from './constants';
import { processMapsWithTranslations, filterMapsBySource } from './utils';
import { MapsDataTable } from './MapsDataTable';
import { InstallationHelpDialog } from './InstallationHelpDialog';
import { WorkshopMapsGrid } from './WorkshopMapsGrid';

export type { MapEntry } from './mapEntry';

type MapsTabId = 'workshop' | 'sirplease' | 'other';

export default function InstalledSVMaps() {
    const mapsTranslations = useMapsTranslations();
    const isAdmin = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    const [helpDialogVisible, setHelpDialogVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<MapsTabId>('workshop');

    // Process maps: replace translation placeholders and filter by source
    const processedMaps = processMapsWithTranslations(
        RAW_INSTALLED_MAPS,
        mapsTranslations.allMaps
    );
    
    const workshopMaps = filterMapsBySource(processedMaps, MAP_SOURCES.WORKSHOP);
    const sirPleaseMaps = filterMapsBySource(processedMaps, MAP_SOURCES.SIR_PLEASE);
    const otherMaps = filterMapsBySource(processedMaps, MAP_SOURCES.OTHER);

    const tabIds = useMemo(() => {
        const ids: MapsTabId[] = ['workshop', 'sirplease'];
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

                    <div className="maps-tab-panels">
                        {activeTab === 'workshop' && (
                            <div
                                className="maps-tab-panel"
                                role="tabpanel"
                                aria-label={mapsTranslations.tabWorkshop}
                            >
                                <WorkshopMapsGrid maps={workshopMaps} mapsTranslations={mapsTranslations} />
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
                                            maps={sirPleaseMaps}
                                            title={mapsTranslations.tabSirPlease}
                                            isAdmin={isAdmin}
                                            mapsTranslations={mapsTranslations}
                                            onHelpClick={handleOpenHelpDialog}
                                            hideTitle
                                        />
                                    )}
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
                                        maps={otherMaps}
                                        title={mapsTranslations.tabOther}
                                        isAdmin={isAdmin}
                                        mapsTranslations={mapsTranslations}
                                        hideTitle
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
