import { useSelector } from 'react-redux';
import backgroundImage from '../../resources/backgrounds/background_5.jpg';
import { gameStatsService } from '../../services/gameStatsService';
import './GameStats.css';
import { AppState } from '../../redux/store';
import { Column } from 'primereact/column';
import {
    DataTable,
    DataTablePageEvent,
    DataTableSortEvent,
} from 'primereact/datatable';
import {
    GameStatEntry,
    GameStatLazyLoadingParams,
} from '../../models/gameStatsModels';
import { useEffect, useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import Navbar from '../navbar/Navbar';
import Footer from '../Footer/Footer';
import { Accordion, AccordionTab } from 'primereact/accordion';

export default function GameStats() {
    const [searchValue, setSearchValue] = useState('');

    const totalRecords = useSelector(
        (state: AppState) => state.gameStatsReducer.totalRecords
    );
    const gameStats = useSelector(
        (state: AppState) => state.gameStatsReducer.gameStats
    );
    const [loading, setLoading] = useState(false);

    const [lazyParams, setLazyParams] = useState<GameStatLazyLoadingParams>({
        first: 0,
        rows: 10,
        page: 0,
        sortField: 'Total_Score',
        sortOrder: 1,
        query: undefined,
    });

    gameStatsService.useGameStatsLoadingService(lazyParams, setLoading);

    const playerEntryHeader = (rowData: GameStatEntry) => {
        return (
            <div className="user-data">
                <img alt="user-avatar" src={rowData.avatarMediumSrc} />
                <span
                // href={rowData.profileUrl}
                >
                    {rowData.LastKnownSteamName}
                </span>
                <div className={'accordion-header-data'}>
                    Overall Score: {rowData.Total_Score}
                </div>
            </div>
        );
    };

    const getPlayerColumnBody = (rowData: GameStatEntry) => {
        return (
            <Accordion activeIndex={-1}>
                <AccordionTab header={playerEntryHeader(rowData)}>
                    <div className="accordion-column">
                        Survivor Stats
                        <div>
                            Total commons killed: {rowData.Commons_Killed}
                        </div>
                        <div>
                            Average common kills (per round)*:{' '}
                            {rowData.Commons_Killed_Per_Round_Average?.toFixed(
                                2
                            )}
                        </div>
                        <div>Hunter skeets: {rowData.Hunter_Skeets}</div>
                        <div>
                            Average hunter skeets (per round)*:{' '}
                            {rowData.Hunters_Skeeted_Per_Round_Average?.toFixed(
                                2
                            )}
                        </div>
                        <div>
                            Damage done to SI: {rowData.Damage_Done_To_SI}
                        </div>
                        <div>
                            Average SI damage (per round)*:{' '}
                            {rowData.Damage_Done_To_SI_Per_Round_Average?.toFixed(
                                2
                            )}
                        </div>
                        <div>
                            Damage done to tanks: {rowData.Damage_Done_To_Tanks}
                        </div>
                        <div>Witch crowns: {rowData.Witch_Crowns}</div>
                        <div>Tongue cuts: {rowData.Tongue_Cuts}</div>
                        <div>
                            Smoker self-clears: {rowData.Smoker_Self_Clears}
                        </div>
                        <div>
                            Tank rocks skeeted: {rowData.Tank_Rocks_Skeeted}
                        </div>
                        <div>FF dmg: {rowData.Friendly_Fire_Done}</div>
                        <div>
                            Average FF (per round)*:{' '}
                            {rowData.Friendly_Fire_Done_Per_Round_Average?.toFixed(
                                2
                            )}
                        </div>
                        <div>
                            Friendly fire received:{' '}
                            {rowData.Friendly_Fire_Received}
                        </div>
                    </div>
                    <div className="accordion-column">
                        Special Infected Stats
                        <div>Death charges: {rowData.Death_Charges}</div>
                        <div>Hunter 25's: {rowData.Hunter_High_Pounces_25}</div>
                        <div>
                            Total Damage done to survivors:{' '}
                            {rowData.Damage_Done_To_Survivors}
                        </div>
                    </div>
                    <div className="accordion-column">
                        Overall Stats
                        <div>
                            Gameplay time: {secondsToHms(rowData.Gameplay_Time)}
                        </div>
                    </div>
                    * - counts for overall score
                </AccordionTab>
            </Accordion>
        );
    };

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            setLazyParams({ ...lazyParams, query: searchValue });
        }, 400);
        return () => {
            clearTimeout(searchTimeout);
        };
    }, [searchValue]);

    const onPage = (event: DataTablePageEvent) => {
        setLazyParams({ ...lazyParams, page: event.page!, first: event.first });
    };

    const onSort = (event: DataTableSortEvent) => {
        setLazyParams({
            ...lazyParams,
            ...event,
            sortOrder:
                lazyParams.sortField === event.sortField
                    ? Number(!Boolean(lazyParams.sortOrder))
                    : lazyParams.sortOrder,
        });
    };

    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor((d % 3600) / 60);
        var s = Math.floor((d % 3600) % 60);

        var hDisplay = h + 'h';
        var mDisplay = m + 'm';
        var sDisplay = s + 's';
        return hDisplay + mDisplay + sDisplay;
    }

    const gameplay_TimeColumnBody = (rowData: GameStatEntry) => {
        return secondsToHms(rowData.Gameplay_Time);
    };

    return (
        <>
            <Navbar />
            <div
                className="game-stats"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="card">
                    <div className="centered-text">Game Stats</div>
                    <div className="card">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search"
                            />
                        </span>
                        <DataTable
                            paginator
                            lazy
                            value={gameStats}
                            scrollable={true}
                            scrollHeight="flex"
                            first={lazyParams.first}
                            rows={10}
                            totalRecords={totalRecords}
                            onPage={onPage}
                            loading={loading}
                            onSort={onSort}
                        >
                            <Column
                                body={getPlayerColumnBody}
                                header="Player"
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
