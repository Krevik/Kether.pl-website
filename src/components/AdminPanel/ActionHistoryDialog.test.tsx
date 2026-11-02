import { beforeAll, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { ActionHistoryMessages } from './ActionHistoryDialog';
import { AdminActionEntry, AdminActionHistory } from '../../services/adminPanelService';
import en from '../../i18n/locales/en.json';

const translations = createInstance();
beforeAll(async () => {
    await translations.init({ lng: 'en', resources: { en: { translation: en } }, interpolation: { escapeValue: false } });
});

function entry(overrides: Partial<AdminActionEntry> = {}): AdminActionEntry {
    return {
        id: 1, steam_id: '76561198000000001', action_id: 2, choice: 'soft_restart',
        unix_time: Date.parse('2026-11-02T10:24:45Z') / 1000,
        modifiers: {}, additional_data: null, outcome: 'completed', error: null, ...overrides,
    };
}

function render(entries: AdminActionEntry[], adminNames: Record<string, string> = {}) {
    const history: AdminActionHistory = {
        enabled: true, maximum: 15, entries, admin_names: adminNames,
        actions: [
            { id: 2, key: 'daemon', choices: ['restart', 'soft_restart'], modifiers: ['force'] },
            { id: 3, key: 'game_server', choices: ['start', 'stop', 'restart'], modifiers: [] },
        ],
    };
    return renderToStaticMarkup(
        <I18nextProvider i18n={translations}><ActionHistoryMessages history={history} /></I18nextProvider>
    );
}

function text(markup: string) {
    return markup.replace(/<[^>]*>/g, '');
}

describe('IRC-style admin history messages', () => {
    it('shows nicknames and past-tense action messages without raw SteamIDs', () => {
        const markup = render([
            entry(),
            entry({ id: 2, steam_id: '76561198000000002', action_id: 3, choice: 'stop' }),
        ], { '76561198000000001': 'Krevik', '76561198000000002': 'SATANIXON' });
        expect(text(markup)).toContain('Krevik soft-restarted the KetherDaemon');
        expect(text(markup)).toContain('SATANIXON stopped the L4D2 game server');
        expect(text(markup)).not.toContain('76561198000000001');
        expect(markup).toContain('href="https://steamcommunity.com/profiles/76561198000000001"');
        expect(markup).toContain('dateTime="2026-11-02T10:24:45.000Z"');
        const timestamp = new Date('2026-11-02T10:24:45Z').toLocaleString('en', {
            year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit',
        });
        expect(text(markup)).toContain(`[${timestamp}]`);
    });

    it('keeps failed, requested, accepted and forced operations distinguishable', () => {
        const markup = render([
            entry({ outcome: 'failed', error: 'Daemon is busy' }),
            entry({ id: 2, outcome: 'requested' }),
            entry({ id: 3, outcome: 'accepted', modifiers: { force: true }, additional_data: { service: 'ksd.service' } }),
        ], { '76561198000000001': 'Krevik' });
        expect(text(markup)).toContain('Krevik failed to soft-restart the KetherDaemon (Failed) — Daemon is busy');
        expect(text(markup)).toContain('Krevik requested to soft-restart the KetherDaemon (Requested)');
        expect(text(markup)).toContain('(Accepted) (Forced restart)');
        expect(markup).toContain('<details>');
        expect(text(markup)).toContain('ksd.service');
    });

    it('uses a readable fallback and escapes Steam nicknames', () => {
        expect(text(render([entry()]))).toContain('Unknown admin soft-restarted the KetherDaemon');
        const markup = render([entry()], { '76561198000000001': '<script>bad()</script>' });
        expect(markup).not.toContain('<script>');
        expect(markup).toContain('&lt;script&gt;bad()&lt;/script&gt;');
    });
});
