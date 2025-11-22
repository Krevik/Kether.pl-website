import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import './InstalledSVMaps.css';
import { Button } from 'primereact/button';
import ST_L from '/favicons/steam-logo-svgrepo.png';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import { useMapsTranslations } from '../../hooks/useTranslations';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/store';

export interface MapEntry {
    id: number;
    mapName: string;
    source: 'Workshop' | 'SirPlease' | 'Other';
    downloadUrl?: string;
}

// Example data with City 17 map
const installedMaps: MapEntry[] = [
    // Workshop maps
    {
        id: 1,
        mapName: '2 Evil Eyes',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=381419931',
    },
    {
        id: 2,
        mapName: 'Whispers of Winter',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1643520526',
    },
    // SirPlease maps (all campaigns from sirplease.vercel.app, excluding Urban Flight)
    {
        id: 3,
        mapName: 'Back To School',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/BackToSchool.zip',
    },
    {
        id: 4,
        mapName: 'Blood Tracks',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/BloodTracks.zip',
    },
    {
        id: 5,
        mapName: 'Carried Off',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/CarriedOff.zip',
    },
    {
        id: 6,
        mapName: 'City 17',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/City17.zip',
    },
    {
        id: 7,
        mapName: 'Cold Front',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/ColdFront.zip',
    },
    {
        id: 8,
        mapName: 'Crash Course Rerouted',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/CrashCourseRerouted.zip',
    },
    {
        id: 9,
        mapName: 'Dark Carnival Remix',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DarkCarnivalRemix.zip',
    },
    {
        id: 10,
        mapName: 'Dark Wood',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DarkWood.zip',
    },
    {
        id: 11,
        mapName: 'Daybreak',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Daybreak.zip',
    },
    {
        id: 12,
        mapName: 'Dead Before Dawn',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeadBeforeDawn.zip',
    },
    {
        id: 13,
        mapName: 'Dead Center Rebirth',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeadCenterRebirth.zip',
    },
    {
        id: 14,
        mapName: 'Dead Center Reconstructed',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeadCenterReconstructed.zip',
    },
    {
        id: 15,
        mapName: 'Death Aboard 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeathAboard2.zip',
    },
    {
        id: 16,
        mapName: 'Death Sentence Redux',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeathSentenceRedux.zip',
    },
    {
        id: 17,
        mapName: 'Detour Ahead',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DetourAhead.zip',
    },
    {
        id: 18,
        mapName: 'Diescraper Redux',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DiescraperRedux.zip',
    },
    {
        id: 19,
        mapName: 'Fatal Freight',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/FatalFreight.zip',
    },
    {
        id: 20,
        mapName: 'Hard Rain Downpour',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HardRainDownpour.zip',
    },
    {
        id: 21,
        mapName: 'Haunted Forest',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HauntedForest.zip',
    },
    {
        id: 22,
        mapName: 'Heaven Can Wait 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HeavenCanWait2.zip',
    },
    {
        id: 23,
        mapName: 'Highway To Hell',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HighwayToHell.zip',
    },
    {
        id: 24,
        mapName: 'I Hate Mountains 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/IHateMountains2.zip',
    },
    {
        id: 25,
        mapName: 'Military Industrial Complex 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/MilitaryIndustrialComplex2.zip',
    },
    {
        id: 26,
        mapName: 'No Echo',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/NoEcho.zip',
    },
    {
        id: 27,
        mapName: 'No Mercy Rehab',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/NoMercyRehab.zip',
    },
    {
        id: 28,
        mapName: 'Open Road',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/OpenRoad.zip',
    },
    {
        id: 29,
        mapName: 'Parish Overgrowth',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/ParishOvergrowth.zip',
    },
    {
        id: 30,
        mapName: 'Redemption 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Redemption2.zip',
    },
    {
        id: 31,
        mapName: 'Suicide Blitz 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/SuicideBlitz2.zip',
    },
    {
        id: 32,
        mapName: 'The Bloody Moors',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/TheBloodyMoors.zip',
    },
    {
        id: 33,
        mapName: 'Tour Of Terror',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/TourOfTerror.zip',
    },
    {
        id: 34,
        mapName: 'Trip Day',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Tripday.zip',
    },
    {
        id: 35,
        mapName: 'Undead Zone',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/UndeadZone.zip',
    },
    {
        id: 36,
        mapName: 'Warcelona',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Warcelona.zip',
    },
    {
        id: 37,
        mapName: "We Don't Go To Ravenholm",
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/WeDontGoToRavenholm.zip',
    },
    {
        id: 38,
        mapName: 'Welcome To Hell',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/WelcomeToHell.zip',
    },
    {
        id: 39,
        mapName: 'Yama',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Yama.zip',
    },
];

/**
 * Extracts Steam Workshop ID from a downloadUrl
 * @param downloadUrl - The download URL (e.g., 'https://steamcommunity.com/sharedfiles/filedetails/?id=381419931')
 * @returns The extracted ID or null if not found
 */
const extractSteamWorkshopId = (downloadUrl: string | undefined): string | null => {
    if (!downloadUrl) return null;
    
    const match = downloadUrl.match(/[?&]id=(\d+)/);
    return match ? match[1] : null;
};

const mapActionsBodyTemplate = (
    rowData: MapEntry,
    mapsTranslations: ReturnType<typeof useMapsTranslations>
) => {
    if (rowData.source === 'Workshop') {
        const workshopId = extractSteamWorkshopId(rowData.downloadUrl);
        
        return (
            <Button
                label={`　${mapsTranslations.install}`}
                icon={<img src={ST_L} width="23px" height="23px" alt="Steam logo" />}
                className="p-button-success"
                onClick={() => {
                    if (workshopId) {
                        window.open(`steam://url/CommunityFilePage/${workshopId}`, '_blank');
                    } else if (rowData.downloadUrl) {
                        // Fallback to opening the URL if ID extraction fails
                        window.open(rowData.downloadUrl, '_blank');
                    }
                }}
            />
        );
    } else {
        return (
            <Button
                label={`🌐　${mapsTranslations.download}`}
                className="p-button-info"
                onClick={() => {
                    if (rowData.downloadUrl) {
                        window.open(rowData.downloadUrl, '_blank');
                    }
                }}
            />
        );
    }
};

const mapNameBodyTemplate = (rowData: MapEntry) => {
    if (rowData.source === 'Workshop') {
        return (
            <a 
                href={rowData.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-source-link"
            >
                {rowData.mapName}
            </a>
        );
    }
    
    return rowData.mapName;
};

export default function InstalledSVMaps() {
    const mapsTranslations = useMapsTranslations();
    const isAdmin: boolean = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );

    // Filter maps by source
    const workshopMaps = installedMaps.filter(map => map.source === 'Workshop');
    const sirPleaseMaps = installedMaps.filter(map => map.source === 'SirPlease');
    const otherMaps = installedMaps.filter(map => map.source === 'Other');

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="installed-sv-maps">
                <div className="card">
                    <div className="centered-text">{mapsTranslations.title}</div>
                    <div className="tables-container">
                        {/* Workshop Maps Table */}
                        {workshopMaps.length > 0 && ( // Only show if there are workshop maps
                        <div className="table-wrapper">
                            <div className="table-title">{mapsTranslations.workshop}</div>
                            <DataTable
                                value={workshopMaps}
                                scrollable={true}
                                scrollHeight="flex"
                                emptyMessage={mapsTranslations.noMapsAvailable}
                            >
                                {isAdmin && (
                                    <Column
                                        field="id"
                                        header={mapsTranslations.databaseId}
                                        sortable
                                    ></Column>
                                )}
                                <Column
                                    field="mapName"
                                    header={mapsTranslations.mapName}
                                    sortable
                                    body={(rowData) =>
                                        mapNameBodyTemplate(rowData)
                                    }
                                ></Column>
                                <Column
                                    header={mapsTranslations.actions}
                                    body={(rowData) =>
                                        mapActionsBodyTemplate(rowData, mapsTranslations)
                                    }
                                ></Column>
                            </DataTable>
                        </div>
                        )}

                        {/* SirPlease Maps Table */}
                        {sirPleaseMaps.length > 0 && ( // Only show if there are SirPlease maps
                        <div className="table-wrapper">
                            <div className="table-title">SirPlease</div>
                            <DataTable
                                value={sirPleaseMaps}
                                scrollable={true}
                                scrollHeight="flex"
                                emptyMessage={mapsTranslations.noMapsAvailable}
                            >
                                {isAdmin && (
                                    <Column
                                        field="id"
                                        header={mapsTranslations.databaseId}
                                        sortable
                                    ></Column>
                                )}
                                <Column
                                    field="mapName"
                                    header={mapsTranslations.mapName}
                                    sortable
                                ></Column>
                                <Column
                                    header={mapsTranslations.actions}
                                    body={(rowData) =>
                                        mapActionsBodyTemplate(rowData, mapsTranslations)
                                    }
                                ></Column>
                            </DataTable>
                        </div>
                        )}

                        {/* Other Maps Table */}
                        {otherMaps.length > 0 && ( // Only show if there are other maps
                        <div className="table-wrapper">
                            <div className="table-title">Other</div>
                            <DataTable
                                value={otherMaps}
                                scrollable={true}
                                scrollHeight="flex"
                                emptyMessage={mapsTranslations.noMapsAvailable}
                            >
                                {isAdmin && (
                                    <Column
                                        field="id"
                                        header={mapsTranslations.databaseId}
                                        sortable
                                    ></Column>
                                )}
                                <Column
                                    field="mapName"
                                    header={mapsTranslations.mapName}
                                    sortable
                                ></Column>
                                <Column
                                    header={mapsTranslations.actions}
                                    body={(rowData) =>
                                        mapActionsBodyTemplate(rowData, mapsTranslations)
                                    }
                                ></Column>
                            </DataTable>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWithBackground>
    );
}

