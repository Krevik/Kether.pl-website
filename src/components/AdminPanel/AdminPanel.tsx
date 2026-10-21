import './AdminPanel.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
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
    restartBackend,
    restartDaemon,
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const timer = setInterval(() => {
            // Restart polling keeps the status fresh on its own meanwhile.
            if (!restartingRef.current.backend && !restartingRef.current.daemon) {
                void loadStatus();
            }
        }, AUTO_REFRESH_MS);
        return () => clearInterval(timer);
    }, [isAdmin, loadStatus]);

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
                service === 'backend' ? await restartBackend() : await restartDaemon(force);
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
                // admin confirm again (which then forces the restart).
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

    if (!isAdmin) {
        return (
            <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_6}>
                <div className="admin-panel">
                    <div className="admin-panel__intro app-surface">
                        <h2 className="admin-panel__title">{tr.title}</h2>
                        <p>{tr.notAdmin}</p>
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
    const confirmForcesDaemon = confirmTarget === 'daemon' && daemonBusy !== null;

    const dialogFooter = (
        <div className="admin-panel__dialog-actions">
            <Button
                label={common.cancel}
                className="admin-panel__btn-cancel app-focus-ring"
                onClick={() => setConfirmTarget(null)}
                disabled={isSubmitting}
            />
            <Button
                label={confirmForcesDaemon ? tr.restartAnyway : tr.restart}
                className={`app-focus-ring ${confirmForcesDaemon ? 'admin-panel__btn-danger' : 'admin-panel__btn-confirm'}`}
                onClick={() => void confirmRestart()}
                loading={isSubmitting}
            />
        </div>
    );

    return (
        <PageWithBackground imageUrl={BACKGROUNDS.BACKGROUND_6}>
            <div className="admin-panel">
                <div className="admin-panel__intro app-surface">
                    <h2 className="admin-panel__title">{tr.title}</h2>
                    <p>{tr.description}</p>
                </div>

                <div className="admin-panel__section-header">
                    <h3 className="admin-panel__section-title">{tr.servicesTitle}</h3>
                    <div className="admin-panel__section-meta">
                        {lastUpdated && (
                            <span className="admin-panel__last-updated">
                                {tr.lastUpdated(lastUpdated.toLocaleTimeString(currentLanguage))}
                            </span>
                        )}
                        <Button
                            label={common.refresh}
                            className="admin-panel__refresh app-focus-ring"
                            onClick={() => void loadStatus()}
                            loading={isLoading}
                        />
                    </div>
                </div>
                {loadError && <p className="admin-panel__error app-surface">{loadError}</p>}

                <div className="admin-panel__services">
                    <ServiceCard
                        name={tr.backendName}
                        description={tr.backendDescription}
                        state={backendState}
                        details={backendDetails}
                        message={backend && !backend.restart_supported ? tr.restartUnavailable : null}
                        canRestart={Boolean(backend?.restart_supported) && !restarting.backend}
                        onRestart={() => setConfirmTarget('backend')}
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
                        onRestart={() => setConfirmTarget('daemon')}
                    />
                </div>
            </div>

            <Dialog
                visible={confirmTarget !== null}
                header={tr.restartConfirmTitle(confirmService)}
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
                    {confirmTarget === 'backend' ? tr.restartBackendConfirm : tr.restartDaemonConfirm}
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
