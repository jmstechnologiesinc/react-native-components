// ADR-0017 §6.3 — PARITY, because 0.2.0 made its absence invisible.
//
// Until this release `setI18nConfig` installed ONE locale, so a key present in
// `en` and missing from `es` rendered as the raw key on a Spanish device: ugly,
// but loud. 0.2.0 adds the `es -> en` fallback the ADR asks for, which is right
// for the user and removes exactly that signal — the same hole now renders
// fluent English and nobody notices.
//
// So the signal moves here. A key that exists on one side and not the other is
// a failure at build time instead of English prose in a Spanish app.
import en from '../Translations/en.json';
import es from '../Translations/es.json';
import { EN as NARRATION_EN, ES as NARRATION_ES } from '@jmstechnologiesinc/order-narration';

const flatten = (node, prefix = '') =>
    Object.entries(node).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        return value && typeof value === 'object' && !Array.isArray(value) ? flatten(value, path) : [path];
    });

const PLACEHOLDER = /%\{(\w+)\}/g;
const placeholdersOf = (text) =>
    typeof text === 'string' ? [...text.matchAll(PLACEHOLDER)].map((match) => match[1]).sort() : [];

const valueAt = (tree, path) => path.split('.').reduce((node, part) => node?.[part], tree);

describe('the library catalogues are in parity', () => {
    const enKeys = flatten(en);
    const esKeys = flatten(es);

    it('has the same key on both sides', () => {
        expect(enKeys.filter((key) => !esKeys.includes(key))).toEqual([]);
        expect(esKeys.filter((key) => !enKeys.includes(key))).toEqual([]);
    });

    it('has the same interpolations on both sides', () => {
        // A placeholder that exists in one language and not the other renders
        // as literal `%{time}` to half the users — which is what the web twin
        // did to «Opens at %{time}» before 0.2.0 fixed its syntax.
        for (const key of enKeys) {
            expect({ key, params: placeholdersOf(valueAt(es, key)) }).toEqual({
                key,
                params: placeholdersOf(valueAt(en, key)),
            });
        }
    });

    it('carries no empty string, which is a hole that renders as one', () => {
        for (const key of enKeys) {
            expect(valueAt(en, key)).not.toBe('');
            expect(valueAt(es, key)).not.toBe('');
        }
    });
});

describe('the narration catalogue is in parity, and this side can render all of it', () => {
    // §6.3: «Una prueba de paridad en cada consumidor falla si el paquete trae
    // una clave que el consumidor no puede renderizar.» This is that test, on
    // this consumer.
    it('ships the same keys in both languages', () => {
        const enKeys = Object.keys(NARRATION_EN).sort();
        const esKeys = Object.keys(NARRATION_ES).sort();
        expect(esKeys).toEqual(enKeys);
    });

    it('ships the same interpolations in both languages', () => {
        for (const key of Object.keys(NARRATION_EN)) {
            expect({ key, params: placeholdersOf(NARRATION_ES[key]) }).toEqual({
                key,
                params: placeholdersOf(NARRATION_EN[key]),
            });
        }
    });

    it('collides with no key of this package, in either direction', () => {
        const libraryKeys = new Set(flatten(en));
        for (const key of Object.keys(NARRATION_EN)) {
            expect(libraryKeys.has(key)).toBe(false);
        }
    });
});
