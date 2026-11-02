import './AdminPanel.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { AppState } from '../../redux/store';
import { PageWithBackground } from '../PageLayout/PageBackground/PageWithBackground';
import { BACKGROUNDS } from '../PageLayout/PageBackground/backgrounds';
import {
    useAdminPanelTranslations,
    useCommonTranslations,
    useTranslations,
} from '../../hooks/useTranslations';
import {
    AdminApiError,
    AdminStatus,
    fetchAdminStatus,
    fetchGameServerStatus,
    GameServerActionResult,
    GameServerStatus,
    gameServerRestart,
    gameServerStart,
    gameServerStop,
    restartBackend,
    restartDaemon,
    softRestartBackend,
    softRestartDaemon,
    tryFetchAdminStatus,
} from '../../services/adminPanelService';
import { notificationManager } from '../../utils/notificationManager';
import {
    hasRestarted,
    RESTART_POLL_INTERVAL_MS,
    RESTART_TIMEOUT_MS,
    ServiceId,
    serviceStartedAt,
} from './adminPanelUtils';
import { ActionHistoryDialog } from './ActionHistoryDialog';
import { GameServerCard, GameServerCardAction } from './GameServerCard';
import { ServiceCard, ServiceDetail, ServiceState, uptimeDetails } from './ServiceCard';

const AUTO_REFRESH_MS = 15_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AdminPanel() {
    const isAdmin = useSelector((state: AppState) => state.userDataReducer.isAdmin);
    const tr = useAdminPanelTranslations();
    const common = useCommonTranslations();
    const { currentLanguage } = useTranslations();

    const [status, setStatus] = useState<AdminStatus | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [restarting, setRestarting] = useState<Record<ServiceId, boolean>>({
        backend: false,
        daemon: false,
    });
    const [confirmTarget, setConfirmTarget] = useState<ServiceId | null>(null);
    const [confirmSoftRestart, setConfirmSoftRestart] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Game server state
    const [gameServerStatus, setGameServerStatus] = useState<GameServerStatus | null>(null);
    const [gameServerLoadError, setGameServerLoadError] = useState<string | null>(null);
    const [gameServerActioning, setGameServerActioning] = useState<GameServerCardAction | null>(null);

    const mounted = useRef(true);
    const restartingRef = useRef(restarting);
    restartingRef.current = restarting;
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const serviceName = useCallback(
        (service: ServiceId) => (service === 'backend' ? tr.backendName : tr.daemonName),
        [tr.backendName, tr.daemonName]
    );

    const applyStatus = useCallback((next: AdminStatus) => {
        setStatus(next);
        setLoadError(null);
        setLastUpdated(new Date());
    }, []);

    const loadGameServerStatus = useCallback(async () => {
        try {
            const gs = await fetchGameServerStatus();
            if (mounted.current) {
                setGameServerStatus(gs);
                setGameServerLoadError(null);
            }
        } catch (error) {
            if (mounted.current) {
                const message = error instanceof Error ? error.message : String(error);
                setGameServerLoadError(message);
            }
        }
    }, []);

    const loadStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            applyStatus(await fetchAdminStatus());
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setLoadError(`${tr.loadFailed}: ${message}`);
        } finally {
            if (mounted.current) {
                setIsLoading(false);
            }
        }
    }, [applyStatus, tr.loadFailed]);

    useEffect(() => {
        if (!isAdmin) {
            return;
        }
        void loadStatus();
        void loadGameServerStatus();
        const timer = setInterval(() => {
            // Restart polling keeps the status fresh on its own meanwhile.
            if (!restartingRef.current.backend && !restartingRef.current.daemon) {
                void loadStatus();
            }
            if (!gameServerActioning) {
                void loadGameServerStatus();
            }
        }, AUTO_REFRESH_MS);
        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, loadStatus, loadGameServerStatus]);

    /** Polls until the service reports a new instance, or gives up after the timeout. */
    const waitForRestart = useCallback(
        async (service: ServiceId, previousStartedAt: Date | null, requestedAt: Date) => {
            const deadline = Date.now() + RESTART_TIMEOUT_MS;
            while (mounted.current && Date.now() < deadline) {
                await sleep(RESTART_POLL_INTERVAL_MS);
                const next = await tryFetchAdminStatus();
                if (!mounted.current) {
                    return;
                }
                if (next) {
                    applyStatus(next);
                    if (hasRestarted(next, service, previousStartedAt, requestedAt)) {
                        notificationManager.SUCCESS(tr.restartCompleted(serviceName(service)));
                        setRestarting((prev) => ({ ...prev, [service]: false }));
                        return;
                    }
                }
            }
            if (mounted.current) {
                notificationManager.ERROR(tr.restartTimedOut(serviceName(service)));
                setRestarting((prev) => ({ ...prev, [service]: false }));
            }
        },
        [applyStatus, serviceName, tr]
    );

    const daemonBusy = status?.daemon.status?.busy ?? null;

    const confirmRestart = async () => {
        if (!confirmTarget) {
            return;
        }
        const service = confirmTarget;
        const force = service === 'daemon' && daemonBusy !== null;
        const previousStartedAt = serviceStartedAt(status, service);
        setIsSubmitting(true);
        try {
            const accepted =
                service === 'backend'
                    ? confirmSoftRestart
                        ? await softRestartBackend()
                        : await restartBackend()
                    : confirmSoftRestart
                      ? await softRestartDaemon(force)
                      : await restartDaemon(force);
            notificationManager.SUCCESS(tr.restartRequested(serviceName(service)));
            setConfirmTarget(null);
            setRestarting((prev) => ({ ...prev, [service]: true }));
            const requestedAt = new Date(accepted.requested_at);
            void waitForRestart(
                service,
                previousStartedAt,
                Number.isNaN(requestedAt.getTime()) ? new Date() : requestedAt
            );
        } catch (error) {
            if (error instanceof AdminApiError && error.status === 409) {
                // The daemon started map work since the last refresh: show why and let the
                // admin confirm again (which then forces the restart)
                notificationManager.ERROR(tr.daemonBusyRefused);
                void loadStatus();
            } else {
                const message = error instanceof Error ? error.message : String(error);
                notificationManager.ERROR(`${tr.restartFailed}: ${message}`);
                setConfirmTarget(null);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGameServerAction = useCallback(
        async (action: GameServerCardAction) => {
            if (gameServerActioning) return;
            setGameServerActioning(action);
            try {
                let result: GameServerActionResult;
                if (action === 'start') result = await gameServerStart();
                else if (action === 'stop') result = await gameServerStop();
                else result = await gameServerRestart();

                if (mounted.current) {
                    setGameServerStatus(result.status);
                    notificationManager.SUCCESS(tr.gameServerActionDone(action));
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                notificationManager.ERROR(`${tr.gameServerActionFailed}: ${message}`);
                // Refresh status after error too
                void loadGameServerStatus();
            } finally {
                if (mounted.current) {
                    setGameServerActioning(null);
                }
            }
        },
        [gameServerActioning, tr, loadGameServerStatus]
    );

    if (!isAdmin) {
        return (
            <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_6}>
                <div className="admin-panel-page">
                    <div className="card app-surface app-page-card admin-panel">
                        <div className="centered-text admin-panel__title">{tr.title}</div>
                        <div className="admin-panel__warning admin-panel__not-admin" role="alert">
                            {tr.notAdmin}
                        </div>
                    </div>
                </div>
            </PageWithBackground>
        );
    }

    const backend = status?.backend ?? null;
    const daemon = status?.daemon ?? null;
    const uptimeLabels = { upSince: tr.upSince, uptime: tr.uptime };

    const backendState: ServiceState = restarting.backend
        ? 'restarting'
        : backend
          ? 'online'
          : loadError
            ? 'offline'
            : 'unknown';
    const backendDetails: ServiceDetail[] = backend
        ? [
              { label: tr.version, value: backend.version },
              { label: tr.pid, value: String(backend.pid) },
              ...uptimeDetails(backend.services_started_at, backend.uptime_secs, currentLanguage, uptimeLabels),
          ]
        : [];

    const daemonState: ServiceState = restarting.daemon
        ? 'restarting'
        : !daemon
          ? 'unknown'
          : daemon.reachable
            ? 'online'
            : 'offline';
    const daemonStatus = daemon?.status ?? null;
    const daemonDetails: ServiceDetail[] = daemonStatus
        ? [
              { label: tr.version, value: daemonStatus.version },
              { label: tr.pid, value: String(daemonStatus.pid) },
              ...uptimeDetails(daemonStatus.started_at, daemonStatus.uptime_secs, currentLanguage, uptimeLabels),
              {
                  label: tr.activity,
                  value: daemonStatus.busy ? tr.busy(daemonStatus.busy) : tr.idle,
              },
          ]
        : [];

    const confirmService = confirmTarget ? serviceName(confirmTarget) : '';
    const confirmAction = confirmSoftRestart ? tr.softRestart : tr.restart;
    const confirmForcesDaemon = confirmTarget === 'daemon' && daemonBusy !== null;

    const dialogFooter = (
        <div className="admin-panel__dialog-actions">
            <Button
                label={`❌ ${common.cancel}`}
                className="admin-panel__btn-cancel app-focus-ring"
                onClick={() => setConfirmTarget(null)}
                disabled={isSubmitting}
            />
            <Button
                label={confirmForcesDaemon ? `⚠️ ${tr.restartAnyway}` : `🔄 ${confirmAction}`}
                className={`app-focus-ring ${confirmForcesDaemon ? 'admin-panel__btn-danger' : 'admin-panel__btn-confirm'}`}
                onClick={() => void confirmRestart()}
                loading={isSubmitting}
            />
        </div>
    );

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_6}>
            <div className="admin-panel-page">
                <div className="card app-surface app-page-card admin-panel">
                    <div className="centered-text admin-panel__title">{tr.title}</div>
                    <p className="admin-panel__description">{tr.description}</p>

                    <Toolbar
                        className="mb-4 admin-panel__toolbar app-toolbar"
                        start={
                            <div className="admin-panel__toolbar-actions">
                                <Button
                                    label={`🔄 ${common.refresh}`}
                                    className="app-focus-ring admin-panel__btn-refresh"
                                    onClick={() => {
                                        void loadStatus();
                                        void loadGameServerStatus();
                                    }}
                                    loading={isLoading}
                                />
                                <Button
                                    label={`📓 ${tr.actionHistory}`}
                                    icon="pi pi-history"
                                    className="app-focus-ring admin-panel__btn-refresh"
                                    onClick={() => setHistoryVisible(true)}
                                />
                            </div>
                        }
                        end={
                            lastUpdated ? (
                                <div
                                    className="admin-panel__last-updated"
                                    title={lastUpdated.toLocaleString(currentLanguage)}
                                >
                                    <i className="pi pi-clock admin-panel__last-updated-icon" aria-hidden="true" />
                                    <span>{tr.lastUpdated(lastUpdated.toLocaleTimeString(currentLanguage))}</span>
                                </div>
                            ) : undefined
                        }
                    />

                    {loadError && (
                        <div className="admin-panel__error" role="alert">
                            <i className="pi pi-exclamation-triangle admin-panel__error-icon" aria-hidden="true" />
                            <span>{loadError}</span>
                        </div>
                    )}

                    <div className="admin-panel__sections-container">
                        <section className="admin-panel__section">
                            <div className="admin-panel__section-header">
                                <h3 className="admin-panel__section-title">{tr.servicesTitle}</h3>
                            </div>
                            <div className="admin-panel__services">
                                <ServiceCard
                                    name={tr.backendName}
                                    description={tr.backendDescription}
                                    state={backendState}
                                    details={backendDetails}
                                    message={backend && !backend.restart_supported && !backend.soft_restart_supported ? tr.restartUnavailable : null}
                                    canRestart={Boolean(backend?.restart_supported) && !restarting.backend}
                                    onRestart={() => {
                                        setConfirmSoftRestart(false);
                                        setConfirmTarget('backend');
                                    }}
                                    canSoftRestart={Boolean(backend?.soft_restart_supported) && !restarting.backend}
                                    onSoftRestart={() => {
                                        setConfirmSoftRestart(true);
                                        setConfirmTarget('backend');
                                    }}
                                />
                                <ServiceCard
                                    name={tr.daemonName}
                                    description={tr.daemonDescription}
                                    state={daemonState}
                                    details={daemonDetails}
                                    message={daemon?.error ?? null}
                                    canRestart={
                                        Boolean(daemonStatus?.restart_supported) &&
                                        Boolean(daemon?.reachable) &&
                                        !restarting.daemon
                                    }
                                    onRestart={() => {
                                        setConfirmSoftRestart(false);
                                        setConfirmTarget('daemon');
                                    }}
                                    canSoftRestart={
                                        Boolean(daemonStatus?.soft_restart_supported) &&
                                        Boolean(daemon?.reachable) &&
                                        !restarting.daemon
                                    }
                                    onSoftRestart={() => {
                                        setConfirmSoftRestart(true);
                                        setConfirmTarget('daemon');
                                    }}
                                />
                            </div>
                        </section>

                        <section className="admin-panel__section">
                            <div className="admin-panel__section-header">
                                <h3 className="admin-panel__section-title">{tr.gameServerStatusSection}</h3>
                            </div>
                            <div className="admin-panel__services">
                                <GameServerCard
                                    status={gameServerStatus}
                                    loadError={gameServerLoadError}
                                    isActioning={gameServerActioning}
                                    onStart={() => void handleGameServerAction('start')}
                                    onStop={() => void handleGameServerAction('stop')}
                                    onRestart={() => void handleGameServerAction('restart')}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <ActionHistoryDialog visible={historyVisible} onHide={() => setHistoryVisible(false)} />

            <Dialog
                visible={confirmTarget !== null}
                header={confirmSoftRestart
                    ? tr.softRestartConfirmTitle(confirmService)
                    : tr.restartConfirmTitle(confirmService)}
                modal
                className="app-dialog admin-panel__dialog"
                style={{ width: '90vw', maxWidth: '520px' }}
                footer={dialogFooter}
                onHide={() => {
                    if (!isSubmitting) {
                        setConfirmTarget(null);
                    }
                }}
            >
                <p>
                    {confirmTarget === 'backend'
                        ? confirmSoftRestart
                            ? tr.softRestartBackendConfirm
                            : tr.restartBackendConfirm
                        : confirmSoftRestart
                          ? tr.softRestartDaemonConfirm
                          : tr.restartDaemonConfirm}
                </p>
                {confirmForcesDaemon && daemonBusy && (
                    <p className="admin-panel__warning" role="alert">
                        {tr.daemonBusyWarning(daemonBusy)}
                    </p>
                )}
            </Dialog>
        </PageWithBackground>
    );
}
