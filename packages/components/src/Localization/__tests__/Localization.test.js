// ADR-0017 §5.4 and §7 rebanada 2 — the repaired `Localization` suite.
//
// WHAT WAS HERE. Two files that had never run: a fixture component importing
// `../IMLocalization`, a module that does not exist in this package, and a
// test rendering it through `@testing-library/react-native`, which is not a
// dependency. Both failed at resolution, so the suite reported «failed to
// run» and nothing about localization was ever checked — which is how
// `localized` came to detect a missing key by searching the rendered text for
// the substring «missing» without anyone noticing (§2.2).
//
// What replaces them tests the three things that were actually wrong, with no
// renderer: the fallback chain, missing-key detection, and the locale in the
// memo key.
import i18n from 'i18n-js';

jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'es', isRTL: false })),
}));

import * as RNLocalize from 'react-native-localize';

import { localized, setI18nConfig } from '../Localization';
import { narrationText, merge, SUPPORTED_LOCALES, FALLBACK_LOCALE } from '../catalog';

const useLocale = (tag) => {
    RNLocalize.findBestLanguageTag.mockReturnValue({ languageTag: tag, isRTL: false });
    setI18nConfig();
};

beforeEach(() => {
    useLocale('es');
});

describe('catalog — the narration catalogue is flat, and stays flat', () => {
    it('merges deeply, the shape the library\'s own nested catalogues have', () => {
        expect(merge({ order: { a: '1', b: '2' } }, { order: { b: '3' } })).toEqual({
            order: { a: '1', b: '3' },
        });
    });

    it('carries both locales and falls back to en', () => {
        expect(SUPPORTED_LOCALES).toContain('en');
        expect(SUPPORTED_LOCALES).toContain('es');
        expect(FALLBACK_LOCALE).toBe('en');
    });

    it('resolves a narration key by exact match, in each language', () => {
        expect(narrationText('order.status.in_transit', 'en')).toBeTruthy();
        expect(narrationText('order.status.in_transit', 'es')).toBeTruthy();
        expect(narrationText('order.status.in_transit', 'en')).not.toBe(
            narrationText('order.status.in_transit', 'es')
        );
    });

    it('answers null for a key the narration does not own', () => {
        expect(narrationText('order.receipt', 'es')).toBeNull();
    });

    // THE REASON THE CATALOGUE IS NOT NESTED. A headline key is a prefix of
    // its own detail, so as a tree one of the two must destroy the other.
    it('keeps a headline AND its detail, which a nested tree could not', () => {
        expect(narrationText('order.message.placed.any.customer', 'en')).toBeTruthy();
        expect(narrationText('order.message.placed.any.customer.detail', 'en')).toBeTruthy();
        expect(narrationText('order.message.placed.any.customer', 'en')).not.toBe(
            narrationText('order.message.placed.any.customer.detail', 'en')
        );
    });

    it('a narration key renders as a string, never as the subtree under it', () => {
        expect(typeof localized('order.message.placed.any.customer', { vendor: 'Casa Nostra' })).toBe('string');
    });
});

describe('setI18nConfig — a real fallback chain (§2.2 defect 1)', () => {
    it('installs every supported locale, not only the device one', () => {
        expect(Object.keys(i18n.translations).sort()).toEqual([...SUPPORTED_LOCALES].sort());
        expect(i18n.locale).toBe('es');
        expect(i18n.fallbacks).toBe(true);
        expect(i18n.defaultLocale).toBe('en');
    });

    it('falls back es -> en instead of rendering the raw key', () => {
        i18n.translations.en = merge(i18n.translations.en, { probe: { onlyInEnglish: 'Only in English' } });
        i18n.translations.es = merge(i18n.translations.es, { probe: {} });
        localized.cache.clear();

        expect(localized('probe.onlyInEnglish')).toBe('Only in English');
    });

    it('falls back to English when the device language is one we do not carry', () => {
        RNLocalize.findBestLanguageTag.mockReturnValue(null);
        setI18nConfig();

        expect(i18n.locale).toBe('en');
    });
});

describe('localized — missing keys by the API, not by substring (§2.2 defect 2)', () => {
    it('returns the key when no locale of the chain has it', () => {
        expect(localized('this.key.does.not.exist')).toBe('this.key.does.not.exist');
    });

    it('returns a real translation that CONTAINS the word «missing»', () => {
        // The old implementation asked `i18n.t(key).includes('missing')` — a
        // substring test against the rendered TEXT — so this string was
        // reported absent and the user was shown the key.
        i18n.translations.es = merge(i18n.translations.es, { probe: { withWord: 'Two items are missing' } });
        localized.cache.clear();

        expect(localized('probe.withWord')).toBe('Two items are missing');
    });

    it('interpolates with the catalogue syntax %{name}', () => {
        i18n.translations.es = merge(i18n.translations.es, { probe: { greet: 'Hola %{name}' } });
        localized.cache.clear();

        expect(localized('probe.greet', { name: 'Marcos' })).toBe('Hola Marcos');
    });
});

describe('localized — the memo carries the locale (§2.2 defect 3)', () => {
    it('answers in the new language after a locale change, without clearing the cache', () => {
        i18n.translations.es = merge(i18n.translations.es, { probe: { word: 'Conductor' } });
        i18n.translations.en = merge(i18n.translations.en, { probe: { word: 'Driver' } });
        localized.cache.clear();

        expect(localized('probe.word')).toBe('Conductor');

        // Deliberately NOT clearing the memo: the resolver must key on the
        // locale, which is what makes the first render after a language change
        // correct rather than stale.
        i18n.locale = 'en';
        expect(localized('probe.word')).toBe('Driver');
    });
});
