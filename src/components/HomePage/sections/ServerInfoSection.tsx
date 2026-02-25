import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { serverInfoService } from '../../../services/serverInfoService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PlayerDetails, ServerInfo } from '../../../models/serverInfoModels';
import { notificationManager } from '../../../utils/notificationManager';
import {
    SECONDARY_SERVER_CONFIG,
    SERVER_CONFIG,
    SUCCESS_MESSAGES,
} from '../../../utils/constants';
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

    const getPlayerList = useCallback((currentServerInfo?: ServerInfo) => {
        if (!currentServerInfo?.playerdetails?.length) return null;

        return (
            <div className={'player-list-table'}>
                <DataTable
                    value={currentServerInfo.playerdetails}
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
    }, [getPlayerGameTimeColumnBody, serverInfoTranslations]);

    const renderServerCard = useCallback(
        (
            currentServerInfo: ServerInfo | undefined,
            serverIp: string,
            steamConnectUrl: string
        ) => (
            <div className="server-info-card">
                <span>{serverInfoTranslations.name}: {currentServerInfo?.name}</span>
                <span>
                    IP: {serverIp}
                    <Button
                        label="📄"
                        className="large-emoji-button app-focus-ring"
                        style={{ scale: '0.8', verticalAlign: 'unset' }}
                        onClick={() => {
                            navigator.clipboard.writeText(serverIp);
                            notificationManager.SUCCESS(SUCCESS_MESSAGES.COPY_SUCCESS);
                        }}
                    >
                        <span className="large-copy-emoji">📄</span>
                    </Button>
                </span>
                <span>
                    {serverInfoTranslations.players}: {currentServerInfo?.players}/{currentServerInfo?.maxplayers} ({currentServerInfo?.bots} {currentServerInfo?.bots === 1 ? serverInfoTranslations.bot : serverInfoTranslations.bots})
                </span>
                <span>
                    {serverInfoTranslations.status}: {currentServerInfo?.status === '1' ? serverInfoTranslations.online : serverInfoTranslations.offline}
                </span>
                <span>{serverInfoTranslations.map}: {currentServerInfo?.map}</span>
                <span>
                    <Button
                        label={serverInfoTranslations.joinGame}
                        className="app-focus-ring"
                        onClick={() => {
                            window.location.href = steamConnectUrl;
                        }}
                    ></Button>
                </span>
                {getPlayerList(currentServerInfo) && (
                    <span>{getPlayerList(currentServerInfo)}</span>
                )}
            </div>
        ),
        [getPlayerList, serverInfoTranslations]
    );

    return (
        <div className="section future-rot server-info-section">
            {renderServerCard(serverInfo, SERVER_CONFIG.IP, SERVER_CONFIG.STEAM_CONNECT_URL)}
            <div className="server-info-card">
                <span>{serverInfoTranslations.name}: {SECONDARY_SERVER_CONFIG.FALLBACK_NAME}</span>
                <span>
                    IP: {SECONDARY_SERVER_CONFIG.IP}
                    <Button
                        label="📄"
                        className="large-emoji-button app-focus-ring"
                        style={{ scale: '0.8', verticalAlign: 'unset' }}
                        onClick={() => {
                            navigator.clipboard.writeText(SECONDARY_SERVER_CONFIG.IP);
                            notificationManager.SUCCESS(SUCCESS_MESSAGES.COPY_SUCCESS);
                        }}
                    >
                        <span className="large-copy-emoji">📄</span>
                    </Button>
                </span>
                <span>
                    <Button
                        label={serverInfoTranslations.joinGame}
                        className="app-focus-ring"
                        onClick={() => {
                            window.location.href = SECONDARY_SERVER_CONFIG.STEAM_CONNECT_URL;
                        }}
                    ></Button>
                </span>
            </div>
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
