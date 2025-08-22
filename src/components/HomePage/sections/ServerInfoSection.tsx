import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { serverInfoService } from '../../../services/serverInfoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PlayerDetails } from '../../../models/serverInfoModels';
import { notificationManager } from '../../../utils/notificationManager';
import { SERVER_CONFIG, SUCCESS_MESSAGES } from '../../../utils/constants';
import { withServerInfoErrorBoundary } from '../../ErrorBoundary/SpecificErrorBoundaries';
import React, { useCallback } from 'react';

function ServerInfoSection() {
    const serverInfo = useSelector(
        (state: AppState) => state.serverInfoReducer.serverInfo
    );

    serverInfoService.useServerInfoLoadingService();

    const getFormattedGamePlayTime = useCallback((duration: number): string => {
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
    }, []);

    const getPlayerGameTimeColumnBody = useCallback((rowData: PlayerDetails) => {
        return <span>{getFormattedGamePlayTime(rowData.duration)}</span>;
    }, [getFormattedGamePlayTime]);

    const getPlayerList = useCallback(() => {
        if (!serverInfo?.playerdetails?.length) return null;
        
        return (
            <div className={'player-list-table'}>
                <DataTable
                    value={serverInfo.playerdetails}
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
    }, [serverInfo, getPlayerGameTimeColumnBody]);

    return (
        <div className="section future-rot">
            <span>Name: {serverInfo?.name}</span>
            <span>
                IP: {SERVER_CONFIG.IP}
                <Button
                    icon={'pi pi-copy'}
                    style={{ scale: '0.8', verticalAlign: 'unset' }}
                    onClick={() => {
                        navigator.clipboard.writeText(SERVER_CONFIG.IP);
                        notificationManager.SUCCESS(SUCCESS_MESSAGES.COPY_SUCCESS);
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
                        window.location.href = SERVER_CONFIG.STEAM_CONNECT_URL;
                    }}
                ></Button>
            </span>
            {getPlayerList() && (
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

export default withServerInfoErrorBoundary(ServerInfoSection);
