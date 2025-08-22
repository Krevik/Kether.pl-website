import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { serverInfoService } from '../../../services/serverInfoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PlayerDetails } from '../../../models/serverInfoModels';
import { notificationManager } from '../../../utils/notificationManager';

export default function ServerInfoSection() {
    const serverInfo = useSelector(
        (state: AppState) => state.serverInfoReducer.serverInfo
    );

    serverInfoService.useServerInfoLoadingService();

    function getFormattedGamePlayTime(duration: number): string {
        // Hours, minutes and seconds
        const hrs = ~~(duration / 3600);
        const mins = ~~((duration % 3600) / 60);
        const secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = '';

        if (hrs > 0) {
            ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
        }

        ret += '' + mins + ':' + (secs < 10 ? '0' : '');
        ret += '' + secs;

        return ret;
    }

    const getPlayerGameTimeColumnBody = (rowData: PlayerDetails) => {
        return <span>{getFormattedGamePlayTime(rowData.duration)}</span>;
    };

    const getPlayerList = () => {
        return (
            <div className={'player-list-table'}>
                <DataTable
                    value={serverInfo!.playerdetails}
                    removableSort
                    sortMode="multiple"
                    scrollable={true}
                >
                    <Column field={'name'} header={'Nickname'} sortable />
                    <Column field={'score'} header={'Score'} sortable />
                    <Column
                        body={getPlayerGameTimeColumnBody}
                        header={'Duration'}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <div className="section future-rot">
            <span>Name: {serverInfo?.name}</span>
            <span>
                IP: 54.36.179.182:27015
                <Button
                    icon={'pi pi-copy'}
                    style={{ scale: '0.8', verticalAlign: 'unset' }}
                    onClick={() => {
                        navigator.clipboard.writeText('54.36.179.182:27015');
                        notificationManager.SUCCESS('IP Copied to clipboard');
                    }}
                />
            </span>
            <span>
                Players: {serverInfo?.players}/{serverInfo?.maxplayers} ({serverInfo?.bots} {serverInfo?.bots === 1 ? 'bot' : 'bots'})
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
                            'steam://connect/54.36.179.182:27015';
                    }}
                ></Button>
            </span>
            {serverInfo && serverInfo.playerdetails.length > 0 && (
                <span>{getPlayerList()}</span>
            )}
            <span className="centered-text">
                You can download all the custom maps installed on the server
                <a
                    style={{
                        display: 'inline-block',
                        marginLeft: '10px',
                        textDecoration: 'none',
                        color: 'white',
                        WebkitTextStroke: ' 3px red',
                    }}
                    href="https://steamcommunity.com/sharedfiles/filedetails/?id=2542824628"
                >
                    HERE
                </a>
            </span>
        </div>
    );
}
