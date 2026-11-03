import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useAdminPanelTranslations, useCommonTranslations, useServerInfoTranslations } from '../../hooks/useTranslations';
import { ServerInfo } from '../../models/serverInfoModels';
import { fetchPrimaryServerInfo } from '../../services/serverInfoService';

export type ConfirmedGameServerAction = 'stop' | 'restart';

interface GameServerActionDialogProps {
    action: ConfirmedGameServerAction | null;
    isSubmitting: boolean;
    onConfirm: () => Promise<void>;
    onHide: () => void;
}

export function GameServerPlayerStatus({
    serverInfo,
    isLoading,
    hasError,
}: {
    serverInfo: ServerInfo | null;
    isLoading: boolean;
    hasError: boolean;
}) {
    const tr = useAdminPanelTranslations();
    const serverTr = useServerInfoTranslations();
    const nicknames = serverInfo?.playerdetails.map((player) => player.name.trim()).filter(Boolean) ?? [];

    return (
        <div className="admin-game-server-confirm__players" aria-live="polite">
            {isLoading ? <p role="status">{tr.gameServerPlayersLoading}</p> : hasError || !serverInfo ? (
                <p role="alert">{tr.gameServerPlayersUnavailable}</p>
            ) : (
                <>
                    <p>{serverTr.players}: {serverInfo.players} / {serverInfo.maxplayers}</p>
                    {nicknames.length > 0 ? <p>{nicknames.join(', ')}</p> : Number(serverInfo.players) > 0 && (
                        <p>{tr.gameServerPlayerNamesUnavailable}</p>
                    )}
                </>
            )}
        </div>
    );
}

export function GameServerActionDialog({ action, isSubmitting, onConfirm, onHide }: GameServerActionDialogProps) {
    const tr = useAdminPanelTranslations();
    const common = useCommonTranslations();
    const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setServerInfo(null);
        setHasError(false);
        setIsLoading(true);
        if (!action) return;
        let active = true;
        void fetchPrimaryServerInfo().then(
            (result) => { if (active) setServerInfo(result); },
            () => { if (active) setHasError(true); }
        ).finally(() => { if (active) setIsLoading(false); });
        return () => { active = false; };
    }, [action]);

    return (
        <Dialog
            visible={action !== null}
            header={action === 'stop' ? tr.gameServerStopConfirmTitle : tr.restartConfirmTitle(tr.gameServerName)}
            modal
            className="app-dialog admin-panel__dialog"
            style={{ width: '90vw', maxWidth: '520px' }}
            onHide={() => { if (!isSubmitting) onHide(); }}
            footer={(
                <div className="admin-panel__dialog-actions">
                    <Button label={`❌ ${common.cancel}`} className="admin-panel__btn-cancel app-focus-ring"
                        disabled={isSubmitting} onClick={onHide} />
                    <Button label={action === 'stop' ? `⏹️ ${tr.gameServerStop}` : `🔄 ${tr.restart}`}
                        className="admin-panel__btn-danger app-focus-ring" disabled={isLoading || isSubmitting}
                        loading={isSubmitting} onClick={() => void onConfirm()} />
                </div>
            )}
        >
            <p>{action === 'stop' ? tr.gameServerStopConfirm : tr.gameServerRestartConfirm}</p>
            <GameServerPlayerStatus serverInfo={serverInfo} isLoading={isLoading} hasError={hasError} />
        </Dialog>
    );
}
