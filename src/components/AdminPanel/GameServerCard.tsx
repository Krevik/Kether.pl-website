import { Button } from 'primereact/button';
import { useAdminPanelTranslations, useTranslations } from '../../hooks/useTranslations';
import { GameServerStatus } from '../../services/adminPanelService';
import { formatUptime } from './adminPanelUtils';

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
    const { currentLanguage } = useTranslations();

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

    const mainStarted = status?.main_started_at ? new Date(status.main_started_at) : null;
    const mainUpSince = mainStarted && !Number.isNaN(mainStarted.getTime())
        ? mainStarted.toLocaleString(currentLanguage)
        : status?.main_started_at ?? null;
    const mainUptime = status?.main_uptime_secs != null ? formatUptime(status.main_uptime_secs) : null;

    const srcdsStarted = status?.srcds_started_at ? new Date(status.srcds_started_at) : null;
    const srcdsUpSince = srcdsStarted && !Number.isNaN(srcdsStarted.getTime())
        ? srcdsStarted.toLocaleString(currentLanguage)
        : status?.srcds_started_at ?? null;
    const srcdsUptime = status?.srcds_uptime_secs != null ? formatUptime(status.srcds_uptime_secs) : null;

    return (
        <section className="admin-service-card admin-game-server-card" aria-label={tr.gameServerName}>
            <header className="admin-service-card__header">
                <h3 className="admin-service-card__name">{tr.gameServerName}</h3>
                <span
                    className={`admin-service-card__state admin-service-card__state--${stateClass}`}
                    role="status"
                >
                    <span className="admin-service-card__state-indicator" aria-hidden="true" />
                    {isActioning ? tr.gameServerActioning(isActioning) : stateLabel}
                </span>
            </header>
            <p className="admin-service-card__description">{tr.gameServerDescription}</p>
            {status && (
                <dl className="admin-service-card__details">
                    <div className="admin-service-card__detail">
                        <dt>{tr.gameServerState}</dt>
                        <dd>{tr.translateSubState(status.sub_state)}</dd>
                    </div>
                    <div className="admin-service-card__detail">
                        <dt>{tr.gameServerService}</dt>
                        <dd>{status.service}</dd>
                    </div>
                    {status.main_pid > 0 && (
                        <>
                            <div className="admin-service-card__detail">
                                <dt>{tr.gameServerMainPid}</dt>
                                <dd>
                                    {status.main_comm
                                        ? `${status.main_pid} (${status.main_comm})`
                                        : status.main_pid}
                                </dd>
                            </div>
                            {mainUpSince && (
                                <div className="admin-service-card__detail">
                                    <dt>{tr.gameServerMainUpSince}</dt>
                                    <dd>{mainUpSince}</dd>
                                </div>
                            )}
                            {mainUptime && (
                                <div className="admin-service-card__detail">
                                    <dt>{tr.gameServerMainUptime}</dt>
                                    <dd>{mainUptime}</dd>
                                </div>
                            )}
                        </>
                    )}
                    {status.srcds_pid != null && status.srcds_pid > 0 && (
                        <>
                            <div className="admin-service-card__detail">
                                <dt>{tr.gameServerSrcdsPid}</dt>
                                <dd>
                                    {status.srcds_comm
                                        ? `${status.srcds_pid} (${status.srcds_comm})`
                                        : status.srcds_pid}
                                </dd>
                            </div>
                            {srcdsUpSince && (
                                <div className="admin-service-card__detail">
                                    <dt>{tr.gameServerSrcdsUpSince}</dt>
                                    <dd>{srcdsUpSince}</dd>
                                </div>
                            )}
                            {srcdsUptime && (
                                <div className="admin-service-card__detail">
                                    <dt>{tr.gameServerSrcdsUptime}</dt>
                                    <dd>{srcdsUptime}</dd>
                                </div>
                            )}
                        </>
                    )}
                </dl>
            )}
            {loadError && <p className="admin-service-card__message">{loadError}</p>}
            <div className="admin-service-card__actions admin-game-server-card__actions">
                <Button
                    label={tr.gameServerStart}
                    icon={isActioning === 'start' ? 'pi pi-spin pi-spinner' : 'pi pi-play'}
                    className="app-focus-ring admin-game-server-card__btn-start"
                    disabled={isBusy || activeState === 'active'}
                    loading={isActioning === 'start'}
                    onClick={onStart}
                />
                <Button
                    label={tr.gameServerStop}
                    icon={isActioning === 'stop' ? 'pi pi-spin pi-spinner' : 'pi pi-power-off'}
                    className="app-focus-ring admin-game-server-card__btn-stop"
                    disabled={isBusy || activeState === 'inactive' || activeState === 'failed'}
                    loading={isActioning === 'stop'}
                    onClick={onStop}
                />
                <Button
                    label={tr.restart}
                    icon={isActioning === 'restart' ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'}
                    className="admin-service-card__restart app-focus-ring"
                    disabled={isBusy}
                    loading={isActioning === 'restart'}
                    onClick={onRestart}
                />
            </div>
        </section>
    );
}
