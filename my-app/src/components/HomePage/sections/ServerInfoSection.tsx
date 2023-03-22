import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { serverInfoService } from '../../../services/serverInfoService';
import { steamServerInfoService } from '../../../services/steamServerInfoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GameStatEntry } from '../../../models/gameStatsModels';
import { SteamPlayerServerData } from '../../../models/serverInfoModels';

export default function ServerInfoSection() {
    const serverInfo = useSelector(
        (state: AppState) => state.serverInfoReducer.serverInfo
    );

    const steamServerInfo = useSelector((state: AppState) => state.serverInfoReducer.steamServerInfo);

    serverInfoService.useServerInfoLoadingService();
    steamServerInfoService.useSteamServerInfoLoadingService();

    function getFormattedGamePlayTime(duration: number): string {
        // Hours, minutes and seconds
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;

        return ret;
    }

    const getPlayerGameTimeColumnBody = (rowData: SteamPlayerServerData) => {
        return (
            <span>{getFormattedGamePlayTime(rowData.duration)}</span>
        );
    };

    const drawPlayerListIfNotEmpty = () => {
        if(steamServerInfo && steamServerInfo.playerCount > 0){
            return (<div className={"player-list-table"}>
                <DataTable value={steamServerInfo.players} removableSort sortMode="multiple" scrollable={true}>
                    <Column 
                        field={"name"}
                        header={"Nickname"}
                        sortable
                    />
                    <Column 
                        field={"score"}
                        header={"Score"}
                        sortable
                    />
                    <Column 
                        body={getPlayerGameTimeColumnBody}
                        header={"Duration"}
                        sortable
                    />
                </DataTable>
            </div>)
        }
        return <></>;
    }

    return (
        <div className="section">
            <span>Name: {serverInfo?.name}</span>
            <span>IP: 51.83.217.86:29800</span>
            <span>
                Players: {serverInfo?.players}/{serverInfo?.maxplayers}
            </span>
            <span>
                Status: {serverInfo?.status === '1' ? 'Online' : 'Offline'}
            </span>
            <span>Map: {serverInfo?.map}</span>
            <span>
                <Button
                    label="Join game"
                    onClick={() => {
                        window.location.href =
                            'steam://connect/51.83.217.86:29800';
                    }}
                ></Button>
            </span>
            <span>{drawPlayerListIfNotEmpty()}</span>
        </div>
    );
}
