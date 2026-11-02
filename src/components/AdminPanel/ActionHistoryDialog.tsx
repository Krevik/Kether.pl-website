import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { useAdminPanelTranslations, useTranslations } from '../../hooks/useTranslations';
import { AdminActionHistory, fetchAdminActionHistory } from '../../services/adminPanelService';

interface ActionHistoryDialogProps {
    visible: boolean;
    onHide: () => void;
}

export function ActionHistoryMessages({ history }: { history: AdminActionHistory }) {
    const tr = useAdminPanelTranslations();
    const { currentLanguage } = useTranslations();

    return (
        <ol className="admin-action-history">
            {history.entries.map((entry) => {
                const definition = history.actions.find((action) => action.id === entry.action_id);
                const timestamp = new Date(entry.unix_time * 1000);
                const validTimestamp = !Number.isNaN(timestamp.getTime());
                const nickname = history.admin_names?.[entry.steam_id]?.trim() || tr.historyUnknownAdmin;
                const target = tr.historyTarget(definition?.key ?? String(entry.action_id));
                return (
                    <li className={`admin-action-history__entry admin-action-history__entry--${entry.outcome}`} key={entry.id}>
                        <time dateTime={validTimestamp ? timestamp.toISOString() : undefined}>
                            [{validTimestamp ? timestamp.toLocaleString(currentLanguage, {
                                year: 'numeric', month: 'numeric', day: 'numeric',
                                hour: 'numeric', minute: '2-digit',
                            }) : String(entry.unix_time)}]
                        </time>{' '}
                        <a className="admin-action-history__nickname"
                            href={`https://steamcommunity.com/profiles/${encodeURIComponent(entry.steam_id)}`}
                            target="_blank" rel="noopener noreferrer">{nickname}</a>{' '}
                        {tr.historyMessage(entry.choice, entry.outcome, target)}
                        {entry.outcome !== 'completed' && (
                            <span className="admin-action-history__outcome"> ({tr.historyOutcome(entry.outcome)})</span>
                        )}
                        {entry.modifiers.force && <span> ({tr.historyForced})</span>}
                        {entry.error && <span className="admin-action-history__error"> — {entry.error}</span>}
                        {entry.additional_data != null && (
                            <details>
                                <summary>{tr.historyDetails}</summary>
                                <pre>{JSON.stringify(entry.additional_data, null, 2)}</pre>
                            </details>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

export function ActionHistoryDialog({ visible, onHide }: ActionHistoryDialogProps) {
    const tr = useAdminPanelTranslations();
    const [history, setHistory] = useState<AdminActionHistory | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;
        let active = true;
        setHistory(null);
        setError(null);
        setIsLoading(true);
        void fetchAdminActionHistory().then(
            (result) => { if (active) setHistory(result); },
            (failure: unknown) => {
                if (active) setError(failure instanceof Error ? failure.message : String(failure));
            }
        ).finally(() => { if (active) setIsLoading(false); });
        return () => { active = false; };
    }, [visible]);

    return (
        <Dialog
            visible={visible}
            header={tr.actionHistory}
            modal
            className="app-dialog admin-panel__dialog"
            style={{ width: '95vw', maxWidth: '800px' }}
            onHide={onHide}
        >
            {isLoading && <p role="status">{tr.historyLoading}</p>}
            {error && <p className="admin-panel__error" role="alert">{tr.historyLoadFailed}: {error}</p>}
            {history && (
                <>
                    {!history.enabled && <p role="status">{tr.historyDisabled}</p>}
                    <p>{tr.historyCount(history.entries.length, history.maximum)}</p>
                    <p className="admin-action-history__hint">{tr.historyAcceptedHint}</p>
                    {history.entries.length === 0 ? <p>{tr.historyEmpty}</p> : (
                        <ActionHistoryMessages history={history} />
                    )}
                </>
            )}
        </Dialog>
    );
}
