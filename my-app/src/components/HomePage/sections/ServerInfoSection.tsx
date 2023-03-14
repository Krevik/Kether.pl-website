import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/store';
import { serverInfoService } from '../../../services/serverInfoService';

export default function ServerInfoSection() {
    const serverInfo = useSelector(
        (state: AppState) => state.serverInfoReducer.serverInfo
    );

    serverInfoService.useServerInfoLoadingService();

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
                {serverInfo &&
                    serverInfo.players &&
                    Number(serverInfo.players) > 0 && (
                        <Button
                            label="Join game"
                            onClick={() => {
                                window.location.href =
                                    'steam://connect/51.83.217.86:29800';
                            }}
                        ></Button>
                    )}
            </span>
        </div>
    );
}
