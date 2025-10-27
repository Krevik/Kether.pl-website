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
import { useCallback } from 'react';
import { useServerInfoTranslations } from '../../../hooks/useTranslations';

function ServerInfoSection() {
    const serverInfo = useSelector(
        (state: AppState) => state.serverInfoReducer.serverInfo
    );
    const serverInfoTranslations = useServerInfoTranslations();

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
                    emptyMessage={serverInfoTranslations.noPlayersAvailable}
                >
                    <Column field={'name'} header={serverInfoTranslations.nickname} sortable />
                    <Column field={'score'} header={serverInfoTranslations.score} sortable />
                    <Column
                        body={getPlayerGameTimeColumnBody}
                        header={serverInfoTranslations.duration}
                    />
                </DataTable>
            </div>
        );
    }, [serverInfo, getPlayerGameTimeColumnBody, serverInfoTranslations]);

    return (
        <div className="section future-rot">
            <span>{serverInfoTranslations.name}: {serverInfo?.name}</span>
            <span>
                IP: {SERVER_CONFIG.IP}
                <Button
                    label="📄"
                    className="large-emoji-button"
                    style={{ scale: '0.8', verticalAlign: 'unset' }}
                    onClick={() => {
                        navigator.clipboard.writeText(SERVER_CONFIG.IP);
                        notificationManager.SUCCESS(SUCCESS_MESSAGES.COPY_SUCCESS);
                    }}
                >
                    <span className="large-copy-emoji">📄</span>
                </Button>
            </span>
            <span>
                {serverInfoTranslations.players}: {serverInfo?.players}/{serverInfo?.maxplayers} ({serverInfo?.bots} {serverInfo?.bots === 1 ? serverInfoTranslations.bot : serverInfoTranslations.bots})
            </span>
            <span>
                {serverInfoTranslations.status}: {serverInfo?.status === '1' ? serverInfoTranslations.online : serverInfoTranslations.offline}
            </span>
            <span>{serverInfoTranslations.map}: {serverInfo?.map}</span>
            <span>
                <Button
                    label={serverInfoTranslations.joinGame}
                    onClick={() => {
                        window.location.href = SERVER_CONFIG.STEAM_CONNECT_URL;
                    }}
                ></Button>
            </span>
            {getPlayerList() && (
                <span>{getPlayerList()}</span>
            )}
            <span className="centered-text">
                {serverInfoTranslations.customMapsText}
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
                    {serverInfoTranslations.here}
                </a>
            </span>
        </div>
    );
}

export default withServerInfoErrorBoundary(ServerInfoSection);
