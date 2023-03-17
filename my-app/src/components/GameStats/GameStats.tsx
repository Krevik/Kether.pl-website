import { useSelector } from 'react-redux';
import backgroundImage from '../../resources/backgrounds/background_5.jpg';
import { gameStatsService } from '../../services/gameStatsService';
import './GameStats.css';
import { AppState } from '../../redux/store';
import { Column } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import {
    GameStatEntry,
    GameStatLazyLoadingParams,
} from '../../models/gameStatsModels';
import { useEffect, useState } from 'react';

export default function GameStats() {
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
        sortField: null,
        sortOrder: null,
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

    const onPage = (event) => {
        setLazyParams(event);
    };

    const onSort = (event) => {
        setLazyParams(event);
    };

    return (
        <div
            className="game-stats"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="card">
                <div className="centered-text">Game Stats</div>
                <div className="card">
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
                        //onSort={onSort}
                        //sortField={lazyParams.sortField}
                        //sortOrder={lazyParams.sortOrder}
                    >
                        <Column body={getPlayerColumnBody} header="Player" />
                        <Column field="Hunter_Skeets" header="Hunter Skeets" />
                        <Column
                            field="Commons_Killed"
                            header="Commons Killed"
                        />
                        <Column
                            field="Damage_Done_To_Survivors"
                            header="Damage Done To Survs"
                        />
                        <Column
                            field="Damage_Done_To_SI"
                            header="Damage Done to SI"
                        />
                        <Column field="Witch_Crowns" header="Witch Crowns" />
                        <Column field="Tongue_Cuts" header="Tongue Cuts" />
                        <Column
                            field="Smoker_Self_Clears"
                            header="Smoker Self Clears"
                        />
                        <Column
                            field="Tank_Rocks_Skeeted"
                            header="Tank Rocks Skeeted"
                        />
                        <Column
                            field="Hunter_High_Pounces_25"
                            header="Hunter High Pounces (25)"
                        />
                        <Column field="Death_Charges" header="Death Charges" />
                        <Column
                            field="Friendly_Fire_Done"
                            header="Friendly Fire Done"
                        />
                        <Column
                            field="Friendly_Fire_Received"
                            header="Friendly Fire Received"
                        />
                        <Column
                            field={'Damage_Done_To_Tanks'}
                            header={'Dmg done to tanks'}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
}
