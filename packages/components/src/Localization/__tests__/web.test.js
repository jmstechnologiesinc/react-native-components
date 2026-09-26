// C-25 — the WEB twin, under the same questions as the native one.
//
// The suite runs on the native resolution, so the twin is required by its own
// path and `./Localization` is pointed at it: that is what a web bundler does
// (`.web.js` first), and it is how `format.js` meets the twin. The language
// detector reads `window.location` at init, which the react-native test
// environment does not define; an empty query string is a browser with no
// `?lng=` in its URL.
jest.mock('../Localization', () => {
    global.window.location = { search: '', hash: '', pathname: '/' };
    return jest.requireActual('../Localization.web');
});

import i18n from 'i18next';

import { localized, registerFlatCatalog, currentLocale } from '../Localization';
import { formatDateTime } from '../format';

const INSTANT = Date.UTC(2026, 8, 26, 15, 30);
const LONG_DATE = { dateStyle: 'long', timeZone: 'UTC' };

beforeAll(() => {
    registerFlatCatalog({
        en: { 'probe.web.status.active': 'Active', 'probe.web.greet': 'Hello %{name}', 'probe.web.onlyEn': 'Only en' },
        es: { 'probe.web.status.active': 'Activo', 'probe.web.greet': 'Hola %{name}' },
    });
});

afterEach(async () => {
    await i18n.changeLanguage('en');
});

describe('registerFlatCatalog — web', () => {
    it('resolves a registered flat key in the active language', async () => {
        await i18n.changeLanguage('es');
        expect(localized('probe.web.status.active')).toBe('Activo');
        await i18n.changeLanguage('en');
        expect(localized('probe.web.status.active')).toBe('Active');
    });

    it('interpolates with the catalogue syntax %{name}', async () => {
        await i18n.changeLanguage('es');
        expect(localized('probe.web.greet', { name: 'Marcos' })).toBe('Hola Marcos');
    });

    it('falls back es -> en for a key only English carries', async () => {
        await i18n.changeLanguage('es');
        expect(localized('probe.web.onlyEn')).toBe('Only en');
    });

    it('serves the same text to a host reading i18next directly', async () => {
        await i18n.changeLanguage('es');
        expect(i18n.t('probe.web.status.active')).toBe('Activo');
    });

    it('still answers a key nobody owns with the key', () => {
        expect(localized('probe.web.absent')).toBe('probe.web.absent');
    });
});

describe('format.js — the locale comes from the active twin', () => {
    it('formats in Spanish when the web twin is in Spanish (it used to be always en)', async () => {
        await i18n.changeLanguage('es');
        expect(currentLocale()).toBe('es');
        expect(formatDateTime(INSTANT, LONG_DATE)).toBe('26 de septiembre de 2026');
    });

    it('formats in English when the web twin is in English', () => {
        expect(formatDateTime(INSTANT, LONG_DATE)).toBe('September 26, 2026');
    });
});
