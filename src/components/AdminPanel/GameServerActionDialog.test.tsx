import { beforeAll, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { GameServerPlayerStatus } from './GameServerActionDialog';
import { ServerInfo } from '../../models/serverInfoModels';
import en from '../../i18n/locales/en.json';

vi.mock('../../services/serverInfoService', () => ({ fetchPrimaryServerInfo: vi.fn() }));

const translations = createInstance();
beforeAll(async () => { await translations.init({ lng: 'en', resources: { en: { translation: en } } }); });

function render(serverInfo: ServerInfo | null, isLoading = false, hasError = false) {
    return renderToStaticMarkup(<I18nextProvider i18n={translations}>
        <GameServerPlayerStatus serverInfo={serverInfo} isLoading={isLoading} hasError={hasError} />
    </I18nextProvider>);
}

const serverInfo: ServerInfo = {
    name: 'Kether.pl', map: 'c1m1_hotel', status: '1', players: '3', maxplayers: '16', bots: 0,
    playerdetails: ['ProPlayer1', 'Noob2', 'Noob3'].map((name) => ({ name, score: 0, duration: 60 })),
};

describe('game server confirmation player status', () => {
    it('shows player totals with comma-separated nicknames on a separate line', () => {
        const markup = render(serverInfo);
        expect(markup).toContain('<p>Players: 3 / 16</p><p>ProPlayer1, Noob2, Noob3</p>');
    });

    it('shows zero players without stale nicknames for an empty server', () => {
        const markup = render({ ...serverInfo, players: '0', playerdetails: [] });
        expect(markup).toContain('Players: 0 / 16');
        expect(markup).not.toContain('ProPlayer1');
    });

    it('distinguishes loading and unavailable information from an empty server', () => {
        expect(render(null, true)).toContain('Checking current players');
        expect(render(null, false, true)).toContain('Player status is unavailable');
        expect(render(null, false, true)).not.toContain('Players: 0');
    });

    it('shows an unavailable-names message when the count is nonzero but names are absent', () => {
        expect(render({ ...serverInfo, playerdetails: [] })).toContain('Player nicknames are unavailable');
    });

    it('renders nicknames as escaped text', () => {
        const markup = render({ ...serverInfo, playerdetails: [{ name: '<script>bad()</script>', score: 0, duration: 1 }] });
        expect(markup).not.toContain('<script>');
        expect(markup).toContain('&lt;script&gt;');
    });
});
