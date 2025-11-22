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
    {
        id: 1,
        mapName: 'City 17',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/City17.zip',
    },
    {
        id: 2,
        mapName: '2 Evil Eyes',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=381419931',
    },
    {
        id: 3,
        mapName: 'Whispers of Winter',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1643520526',
    },
    {
        id: 4,
        mapName: 'Back to School',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/BackToSchool.zip',
    },
    {
        id: 5,
        mapName: 'Blood Tracks',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/BloodTracks.zip',
    },
    {
        id: 6,
        mapName: 'Dark Carnival Remix',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/DarkCarnivalRemix.zip',
    },
    {
        id: 7,
        mapName: 'Day Break',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/DayBreak.zip',
    },
    {
        id: 8,
        mapName: 'Dead Before Dawn',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/DeadBeforeDawn.zip',
    },
    {
        id: 9,
        mapName: 'Death Aboard',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/DeathAboard.zip',
    },
    {
        id: 10,
        mapName: 'I Hate Mountains',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/IHateMountains.zip',
    },
    {
        id: 11,
        mapName: 'One 4 Nine',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/One4Nine.zip',
    },
    {
        id: 12,
        mapName: 'Questionable Ethics',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/QuestionableEthics.zip',
    },
    {
        id: 13,
        mapName: 'Suicide Blitz 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/SuicideBlitz2.zip',
    },
    {
        id: 14,
        mapName: 'The Passing',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/ThePassing.zip',
    },
    {
        id: 15,
        mapName: 'The Sacrifice',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/TheSacrifice.zip',
    },
    {
        id: 16,
        mapName: 'Wan Li',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/campaigns/WanLi.zip',
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

const mapSourceBodyTemplate = (
    rowData: MapEntry,
    mapsTranslations: ReturnType<typeof useMapsTranslations>
) => {
    const sourceText = rowData.source === 'Workshop' 
        ? mapsTranslations.workshop 
        : rowData.source; // SirPlease and Other are not translatable
    
    if (rowData.downloadUrl) {
        return (
            <a 
                href={rowData.downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-source-link"
            >
                {sourceText}
            </a>
        );
    }
    
    return sourceText;
};

export default function InstalledSVMaps() {
    const mapsTranslations = useMapsTranslations();
    const isAdmin: boolean = useSelector(
        (state: AppState) => state.userDataReducer.isAdmin
    );
    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_4}>
            <div className="installed-sv-maps">
                <div className="card">
                    <div className="centered-text">{mapsTranslations.title}</div>
                    <div className="card">
                        <DataTable
                            value={installedMaps}
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
                                field="source"
                                header={mapsTranslations.source}
                                body={(rowData) =>
                                    mapSourceBodyTemplate(rowData, mapsTranslations)
                                }
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
                </div>
            </div>
        </PageWithBackground>
    );
}

