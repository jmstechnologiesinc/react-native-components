// Canon §17.5 R1 — THE PRESENTATION TABLES COVER THE PACKAGE'S VOCABULARY.
//
// The tone of a status value and the look of a staff intent are decided in
// `Partner/viewModel.js` (one consumer: request #6 was declined), but the
// values themselves belong to `@jmstechnologiesinc/partner`. So nothing here
// lists a value: every walk starts from the package. A value the package adds
// to a coloured group, or an intent it adds to STAFF_INTENT, fails this suite
// until the view model gives it a tone or a presentation — it never reaches a
// screen as a silent `neutral` or as an unconfirmed button.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'es', isRTL: false })),
}));

import { EN, ES, LABEL_GROUPS, STAFF_INTENT, statusLabelKey } from '@jmstechnologiesinc/partner';

import { registerFlatCatalog, setI18nConfig } from '../../Localization/Localization';
import { STATUS_TONES } from '../../tones';
import {
    INTENT_PRESENTATION,
    LABEL_ONLY_KINDS,
    STATUS_KIND_GROUP,
    TONE_BY_KIND,
    intentAction,
    statusLabel,
    statusTone,
} from '../viewModel';

const has = (table, key) => Object.prototype.hasOwnProperty.call(table, key);
const valuesOfGroup = (group) => Object.values(LABEL_GROUPS[group]);
const TONES = Object.values(STATUS_TONES);

const COLOURED_KINDS = Object.keys(TONE_BY_KIND);

describe('every kind maps to a real LABEL_GROUPS group', () => {
    it.each(Object.entries(STATUS_KIND_GROUP))('%s -> %s', (kind, group) => {
        expect(typeof group).toBe('string');
        expect(has(LABEL_GROUPS, group)).toBe(true);
    });

    it('every kind is either coloured or declared label-only, never both', () => {
        const kinds = Object.keys(STATUS_KIND_GROUP).sort();
        expect([...COLOURED_KINDS, ...LABEL_ONLY_KINDS].sort()).toEqual(kinds);
        expect(COLOURED_KINDS.filter((kind) => LABEL_ONLY_KINDS.includes(kind))).toEqual([]);
    });
});

describe('every value of each coloured group has an explicit tone', () => {
    const cases = COLOURED_KINDS.flatMap((kind) =>
        valuesOfGroup(STATUS_KIND_GROUP[kind]).map((value) => [kind, STATUS_KIND_GROUP[kind], value])
    );

    it('walks a non-empty vocabulary', () => {
        expect(cases.length).toBeGreaterThan(COLOURED_KINDS.length);
    });

    it.each(cases)('%s (%s) / %s', (kind, group, value) => {
        expect(has(TONE_BY_KIND[kind], value)).toBe(true);
        expect(TONES).toContain(TONE_BY_KIND[kind][value]);
        expect(statusTone(kind, value)).toBe(TONE_BY_KIND[kind][value]);
    });

    it.each(COLOURED_KINDS)('%s colours nothing outside its group', (kind) => {
        const members = new Set(valuesOfGroup(STATUS_KIND_GROUP[kind]));
        expect(Object.keys(TONE_BY_KIND[kind]).filter((value) => !members.has(value))).toEqual([]);
    });
});

describe('every staff intent has a presentation', () => {
    it.each(Object.values(STAFF_INTENT))('%s', (intent) => {
        expect(has(INTENT_PRESENTATION, intent)).toBe(true);
        const action = intentAction(intent);
        expect(['primary', 'danger']).toContain(action.tone);
        expect(action.icon).toEqual(expect.any(String));
        expect(action.confirm).toBe(action.tone === 'danger');
    });

    it('presents nothing the package does not declare', () => {
        const intents = new Set(Object.values(STAFF_INTENT));
        expect(Object.keys(INTENT_PRESENTATION).filter((intent) => !intents.has(intent))).toEqual([]);
    });
});

describe('with the package catalogue registered, every kind value is text', () => {
    beforeAll(() => {
        setI18nConfig();
        registerFlatCatalog({ en: EN, es: ES });
    });

    const cases = Object.entries(STATUS_KIND_GROUP).flatMap(([kind, group]) =>
        valuesOfGroup(group).map((value) => [kind, value, ES[statusLabelKey(group, value)]])
    );

    it.each(cases)('%s / %s -> %s', (kind, value, label) => {
        expect(label).toEqual(expect.any(String));
        expect(statusLabel(kind, value)).toBe(label);
    });

    // Every group the package labels, the ones partner 0.1.1 added included (`fact`, `field_error_code`,
    // `rule_error_code`): each value is text in both locales, and `statusLabel` reaches it by the group's name.
    const groupCases = Object.entries(LABEL_GROUPS).flatMap(([group, values]) =>
        Object.values(values).map((value) => [group, value])
    );

    it('walks every group of the package', () => {
        expect(Object.keys(LABEL_GROUPS)).toEqual(
            expect.arrayContaining(['fact', 'field_error_code', 'rule_error_code'])
        );
    });

    // A TEMPLATE (`vehicle_check`'s `%{actual}` / `%{expected}`, the consent texts' `%{platform}`) is reached too,
    // but a label call passes no values, and i18n-js 3 marks a missing placeholder in a way that nests when it
    // repeats. So a template is checked up to its first placeholder: the catalogue's text, never the bare value.
    const TEMPLATE = /%\{\w+\}/;

    it.each(groupCases)('%s / %s is text in en and es', (group, value) => {
        const key = statusLabelKey(group, value);
        expect(EN[key]).toEqual(expect.any(String));
        expect(ES[key]).toEqual(expect.any(String));
        if (TEMPLATE.test(ES[key])) {
            expect(statusLabel(group, value).startsWith(ES[key].split(TEMPLATE)[0])).toBe(true);
        } else {
            expect(statusLabel(group, value)).toBe(ES[key]);
        }
    });

    it.each(Object.values(STAFF_INTENT))('intent %s is titled by the catalogue', (intent) => {
        const [intentGroup] = Object.entries(LABEL_GROUPS).find(([, values]) => values === STAFF_INTENT);
        const label = ES[statusLabelKey(intentGroup, intent)];
        expect(label).toEqual(expect.any(String));
        expect(intentAction(intent).title).toBe(label);
    });
});
