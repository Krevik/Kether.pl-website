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

    const getPlayerGameTimeColumnBody = (rowData: SteamPlayerServerData) => {
        return (
            <span>{Number(rowData.duration.toFixed(0))}</span>
        );
    };

    const drawPlayerListIfNotEmpty = () => {
        if(steamServerInfo && steamServerInfo.playerCount > 0){
            return (<div className={"player-list-table"}><DataTable value={steamServerInfo.players} scrollable={true} >
                <Column field={"index"} header={"ID"}/>
                <Column field={"name"} header={"Nickname"}/>
                <Column field={"score"} header={"Score"}/>
                <Column body={getPlayerGameTimeColumnBody} header={"Duration"}/>
            </DataTable></div>)
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
                {drawPlayerListIfNotEmpty()}
            </span>
        </div>
    );
}
