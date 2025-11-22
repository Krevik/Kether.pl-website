import { useState } from 'react';
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

export interface MapEntry {
    id: number;
    mapName: string;
    source: 'Workshop' | 'SirPlease' | 'Other';
    downloadUrl?: string;
}

export default function InstalledSVMaps() {
    const mapsTranslations = useMapsTranslations();
    const isAdmin = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    const [helpDialogVisible, setHelpDialogVisible] = useState(false);

    // Process maps: replace translation placeholders and filter by source
    const processedMaps = processMapsWithTranslations(
        RAW_INSTALLED_MAPS,
        mapsTranslations.allMaps
    );
    
    const workshopMaps = filterMapsBySource(processedMaps, MAP_SOURCES.WORKSHOP);
    const sirPleaseMaps = filterMapsBySource(processedMaps, MAP_SOURCES.SIR_PLEASE);
    const otherMaps = filterMapsBySource(processedMaps, MAP_SOURCES.OTHER);

    const handleOpenHelpDialog = () => setHelpDialogVisible(true);
    const handleCloseHelpDialog = () => setHelpDialogVisible(false);

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="installed-sv-maps">
                <div className="card">
                    <div className="centered-text">{mapsTranslations.title}</div>
                    <div className="tables-container">
                        <MapsDataTable
                            maps={workshopMaps}
                            title={mapsTranslations.workshop}
                            isAdmin={isAdmin}
                            mapsTranslations={mapsTranslations}
                        />
                        
                        <MapsDataTable
                            maps={sirPleaseMaps}
                            title="SirPlease"
                            isAdmin={isAdmin}
                            mapsTranslations={mapsTranslations}
                            onHelpClick={handleOpenHelpDialog}
                        />
                        
                        <MapsDataTable
                            maps={otherMaps}
                            title="Other"
                            isAdmin={isAdmin}
                            mapsTranslations={mapsTranslations}
                        />
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
