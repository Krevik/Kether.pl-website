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
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';

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
        sortField: undefined,
        sortOrder: 0,
        query: undefined,
    });

    gameStatsService.useGameStatsLoadingService(lazyParams, setLoading);

    const getPlayerColumnBody = (rowData: GameStatEntry) => {
        return (
            <div className="user-data">
                <img alt="user-avatar" src={rowData.avatarMediumSrc} />
                <a href={rowData.profileUrl}>{rowData.LastKnownSteamName}</a>
            </div>
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
            sortOrder: ~lazyParams.sortOrder!,
        });
    };

    return (
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
                        first={lazyParams.first}
                        rows={10}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        loading={loading}
                        onSort={onSort}
                        //sortField={lazyParams.sortField}
                        //sortOrder={lazyParams.sortOrder}
                    >
                        <Column body={getPlayerColumnBody} header="Player" />
                        <Column
                            field="Hunter_Skeets"
                            header="Hunter Skeets"
                            sortable
                        />
                        <Column
                            field="Commons_Killed"
                            header="Commons Killed"
                            sortable
                        />
                        <Column
                            field="Damage_Done_To_Survivors"
                            header="Damage Done To Survs"
                            sortable
                        />
                        <Column
                            field="Damage_Done_To_SI"
                            header="Damage Done to SI"
                            sortable
                        />
                        <Column
                            field="Witch_Crowns"
                            header="Witch Crowns"
                            sortable
                        />
                        <Column
                            field="Tongue_Cuts"
                            header="Tongue Cuts"
                            sortable
                        />
                        <Column
                            field="Smoker_Self_Clears"
                            header="Smoker Self Clears"
                            sortable
                        />
                        <Column
                            field="Tank_Rocks_Skeeted"
                            header="Tank Rocks Skeeted"
                            sortable
                        />
                        <Column
                            field="Hunter_High_Pounces_25"
                            header="Hunter High Pounces (25)"
                            sortable
                        />
                        <Column
                            field="Death_Charges"
                            header="Death Charges"
                            sortable
                        />
                        <Column
                            field="Friendly_Fire_Done"
                            header="Friendly Fire Done"
                            sortable
                        />
                        <Column
                            field="Friendly_Fire_Received"
                            header="Friendly Fire Received"
                            sortable
                        />
                        <Column
                            field={'Damage_Done_To_Tanks'}
                            header={'Dmg done to tanks'}
                            sortable
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
