import { Button } from 'primereact/button';
import { useAdminPanelTranslations } from '../../hooks/useTranslations';
import { GameServerStatus } from '../../services/adminPanelService';

export type GameServerCardAction = 'start' | 'stop' | 'restart';

export interface GameServerCardProps {
    status: GameServerStatus | null;
    loadError: string | null;
    isActioning: GameServerCardAction | null;
    onStart: () => void;
    onStop: () => void;
    onRestart: () => void;
}

export function GameServerCard({
    status,
    loadError,
    isActioning,
    onStart,
    onStop,
    onRestart,
}: GameServerCardProps) {
    const tr = useAdminPanelTranslations();

    const activeState = status?.active_state ?? 'unknown';
    const stateLabel = {
        active: tr.statusOnline,
        inactive: tr.statusOffline,
        activating: tr.statusRestarting,
        deactivating: tr.statusRestarting,
        failed: tr.statusOffline,
        unknown: tr.statusUnknown,
    }[activeState] ?? tr.statusUnknown;

    const stateClass = {
        active: 'online',
        inactive: 'offline',
        activating: 'restarting',
        deactivating: 'restarting',
        failed: 'offline',
        unknown: 'unknown',
    }[activeState] ?? 'unknown';

    const isBusy = isActioning !== null;

    return (
        <section className="admin-service-card app-surface" aria-label={tr.gameServerName}>
            <header className="admin-service-card__header">
                <h3 className="admin-service-card__name">{tr.gameServerName}</h3>
                <span
                    className={`admin-service-card__state admin-service-card__state--${stateClass}`}
                    role="status"
                >
                    {isActioning ? tr.gameServerActioning(isActioning) : stateLabel}
                </span>
            </header>
            <p className="admin-service-card__description">{tr.gameServerDescription}</p>
            {status && (
                <dl className="admin-service-card__details">
                    <div className="admin-service-card__detail">
                        <dt>{tr.gameServerService}</dt>
                        <dd>{status.service}</dd>
                    </div>
                    <div className="admin-service-card__detail">
                        <dt>{tr.gameServerSubState}</dt>
                        <dd>{status.sub_state || '—'}</dd>
                    </div>
                    {status.main_pid > 0 && (
                        <div className="admin-service-card__detail">
                            <dt>{tr.pid}</dt>
                            <dd>{status.main_pid}</dd>
                        </div>
                    )}
                </dl>
            )}
            {loadError && <p className="admin-service-card__message">{loadError}</p>}
            <div className="admin-service-card__actions admin-game-server-card__actions">
                <Button
                    label={tr.gameServerStart}
                    className="app-focus-ring admin-game-server-card__btn-start"
                    disabled={isBusy || activeState === 'active'}
                    loading={isActioning === 'start'}
                    onClick={onStart}
                />
                <Button
                    label={tr.gameServerStop}
                    className="app-focus-ring admin-game-server-card__btn-stop"
                    disabled={isBusy || activeState === 'inactive' || activeState === 'failed'}
                    loading={isActioning === 'stop'}
                    onClick={onStop}
                />
                <Button
                    label={tr.restart}
                    className="app-focus-ring"
                    disabled={isBusy}
                    loading={isActioning === 'restart'}
                    onClick={onRestart}
                />
            </div>
        </section>
    );
}
