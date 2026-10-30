import { Button } from 'primereact/button';
import { useAdminPanelTranslations } from '../../hooks/useTranslations';
import { formatUptime } from './adminPanelUtils';

export type ServiceState = 'online' | 'offline' | 'restarting' | 'unknown';

export interface ServiceDetail {
    label: string;
    value: string;
}

export interface ServiceCardProps {
    name: string;
    description: string;
    state: ServiceState;
    details: ServiceDetail[];
    /** Shown instead of / below the details (e.g. why the daemon is unreachable). */
    message?: string | null;
    canRestart: boolean;
    onRestart: () => void;
}

/** Status card for one service, with its maintenance actions. */
export function ServiceCard({
    name,
    description,
    state,
    details,
    message,
    canRestart,
    onRestart,
}: ServiceCardProps) {
    const tr = useAdminPanelTranslations();
    const stateLabel = {
        online: tr.statusOnline,
        offline: tr.statusOffline,
        restarting: tr.statusRestarting,
        unknown: tr.statusUnknown,
    }[state];

    return (
        <section className="admin-service-card" aria-label={name}>
            <header className="admin-service-card__header">
                <h3 className="admin-service-card__name">{name}</h3>
                <span
                    className={`admin-service-card__state admin-service-card__state--${state}`}
                    role="status"
                >
                    <span className="admin-service-card__state-indicator" aria-hidden="true" />
                    {stateLabel}
                </span>
            </header>
            <p className="admin-service-card__description">{description}</p>
            {details.length > 0 && (
                <dl className="admin-service-card__details">
                    {details.map((detail) => (
                        <div className="admin-service-card__detail" key={detail.label}>
                            <dt>{detail.label}</dt>
                            <dd>{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {message && <p className="admin-service-card__message">{message}</p>}
            <div className="admin-service-card__actions">
                <Button
                    label={`🔄 ${tr.restart}`}
                    className="admin-service-card__restart app-focus-ring"
                    disabled={!canRestart}
                    loading={state === 'restarting'}
                    onClick={onRestart}
                />
            </div>
        </section>
    );
}

/** Formats an ISO timestamp + uptime as the two standard detail rows. */
export function uptimeDetails(
    startedAtIso: string,
    uptimeSecs: number,
    language: string,
    labels: { upSince: string; uptime: string }
): ServiceDetail[] {
    const startedAt = new Date(startedAtIso);
    const upSince = Number.isNaN(startedAt.getTime())
        ? startedAtIso
        : startedAt.toLocaleString(language);
    return [
        { label: labels.upSince, value: upSince },
        { label: labels.uptime, value: formatUptime(uptimeSecs) },
    ];
}
