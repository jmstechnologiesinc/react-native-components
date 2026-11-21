// The web twin's language, from its address: a page that names its language (`/us/es/terms`) is shown in it before
// the first render, the visit is not remembered, and only a person's own choice (chooseLanguage) is.
//
// As web.test.js does, the twin is required by its own path on the native resolution; the detector reads
// `window.location` and `window.localStorage` at init, which the react-native test environment does not define. The
// storage lives inside the factory: jest hoists the factory above the file's own declarations.
jest.mock('../Localization', () => {
    const values = new Map();
    global.window.location = { search: '', hash: '', pathname: '/us/es/terms' };
    global.window.localStorage = {
        getItem: (key) => (values.has(key) ? values.get(key) : null),
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
    };
    return jest.requireActual('../Localization.web');
});

import i18n from 'i18next';

import { chooseLanguage, currentLocale } from '../Localization';

describe('the language of a web page', () => {
    it('is the one its address names, from the start, and the visit is not remembered', () => {
        expect(currentLocale()).toBe('es');
        expect(window.localStorage.getItem('i18nextLng')).toBeNull();
    });

    it('takes no path segment that is not a language for one', () => {
        expect(i18n.services.languageUtils.isSupportedCode('history')).toBe(false);
    });

    it("remembers a person's own choice", async () => {
        await chooseLanguage('en');

        expect(currentLocale()).toBe('en');
        expect(window.localStorage.getItem('i18nextLng')).toBe('en');
    });
});
