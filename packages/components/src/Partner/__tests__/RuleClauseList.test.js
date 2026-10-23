// Request #105: a requirement's composed rule, as the server sends it (`requirementRule`), is projected clause by
// clause — one Paper List.Item per clause the rule states, titled by the clause and valued by the rule, in Spanish
// from the package's catalogue — and nothing the rule does not say.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'es', isRTL: false })),
}));

import React from 'react';
import { Linking } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { List, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';
import { EN, ES } from '@jmstechnologiesinc/partner';

import { registerFlatCatalog, setI18nConfig } from '../../Localization/Localization';
import RuleClauseList from '../RuleClauseList';
import { ruleClauseRows } from '../viewModel';

jest.useFakeTimers();

const mounted = [];

const render = (element) => {
    let tree;
    act(() => {
        tree = renderer.create(<Provider theme={MD3LightTheme}>{element}</Provider>);
    });
    mounted.push(tree);
    return tree;
};

afterEach(() => {
    act(() => {
        mounted.splice(0).forEach((tree) => tree.unmount());
        jest.runOnlyPendingTimers();
    });
});

beforeAll(() => {
    setI18nConfig();
    registerFlatCatalog({ en: EN, es: ES });
});

const RULE = Object.freeze({
    scope: 'vehicle',
    layers: ['US', 'US-MA'],
    expiry: { noticeDays: 30, graceDays: 0 },
    reviewSlaHours: 24,
    onboardingWindowDays: null,
    recheckEveryMonths: null,
    evidence: 'document',
    screening: null,
    reviewQueue: 'documents',
    vinRequired: null,
    consent: null,
    label: null,
    explanation: { en: 'The vehicle\'s valid insurance policy.', es: 'La póliza de seguro vigente del vehículo.' },
    legalBasis: [{ name: { en: 'Compulsory insurance', es: 'Seguro obligatorio' }, citation: 'G.L. c. 90 §34A', url: 'https://malegislature.gov/' }],
    references: [{ title: { en: 'Uber · insurance', es: 'Uber · seguro' }, url: 'https://www.uber.com/', supports: 'asked' }],
});
const NAMES = Object.freeze({ US: 'Estados Unidos', 'US-MA': 'Massachusetts' });
const layerName = (layer) => NAMES[layer];

describe('ruleClauseRows', () => {
    it('one row per clause the rule states, in order: the clause as title, the rule\'s value as description', () => {
        expect(ruleClauseRows(RULE, { layerName })).toEqual([
            { key: 'rule_explanation', title: 'Qué es', description: 'La póliza de seguro vigente del vehículo.' },
            { key: 'met_by', title: 'Cómo se cumple', description: ES['partner.requirement_evidence.document'] },
            { key: 'asked_per', title: 'Se pide a', description: ES['partner.entity_type.vehicle'] },
            { key: 'reviewed_by', title: 'Quién lo revisa', description: ES['partner.review_queue.documents'] },
            { key: 'review_within', title: 'Plazo de revisión', description: '24 h' },
            { key: 'expiry_notice', title: 'Aviso antes de vencer', description: '30 días' },
            { key: 'expiry_grace', title: 'Gracia después de vencer', description: '0 días' },
            { key: 'asked_by', title: 'Lo piden', description: 'Estados Unidos › Massachusetts' },
            {
                key: 'legal_basis.0',
                title: 'Base legal',
                description: 'Seguro obligatorio · G.L. c. 90 §34A',
                url: 'https://malegislature.gov/',
            },
            {
                key: 'market_reference.0',
                title: 'Práctica de mercado',
                description: 'Uber · seguro · Respalda que se pida',
                url: 'https://www.uber.com/',
            },
        ]);
    });

    it('reads the background check and the consent clauses, a false one too', () => {
        const rule = {
            ...RULE,
            screening: { package: 'basic_mvr', continuous: false, provider: 'checkr' },
            consent: { type: 'tos', textApproved: true },
            recheckEveryMonths: 12,
            legalBasis: [],
            references: [],
        };
        const byKey = Object.fromEntries(ruleClauseRows(rule).map((row) => [row.key, row.description]));
        expect(byKey).toMatchObject({
            recheck_every: '12 meses',
            screening_level: ES['partner.screening_package.basic_mvr'],
            screening_continuous: 'No',
            screening_provider: ES['partner.integration_provider.checkr'],
            consent_kind: ES['partner.consent_type.tos'],
            consent_text_approved: 'Sí',
            asked_by: 'US › US-MA',
        });
        expect(byKey).not.toHaveProperty('legal_basis.0');
    });

    it('a rule the server did not send (a partner evaluated before #105) has no rows', () => {
        expect(ruleClauseRows(null)).toEqual([]);
    });
});

describe('RuleClauseList', () => {
    it('is a named list of Paper List.Items, one per row', () => {
        const tree = render(<RuleClauseList rule={RULE} layerName={layerName} accessibilityLabel="Seguro" />);
        const list = tree.root.find((node) => node.type === 'View' && node.props.role === 'list');
        expect(list.props['aria-label']).toBe('Seguro');
        const items = tree.root.findAllByType(List.Item);
        expect(items.map((item) => [item.props.title, item.props.description])).toEqual(
            ruleClauseRows(RULE, { layerName }).map((row) => [row.title, row.description])
        );
    });

    it('a cited norm or practice opens its address; a plain clause is not pressable', () => {
        const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        const tree = render(<RuleClauseList rule={RULE} accessibilityLabel="Seguro" />);
        const itemOf = (testID) => tree.root.findAllByType(List.Item).find((item) => item.props.testID === testID);
        expect(itemOf('rule-clauses-met_by').props.onPress).toBeUndefined();
        const norm = itemOf('rule-clauses-legal_basis.0');
        expect(norm.props['aria-label']).toBe('Base legal: Seguro obligatorio · G.L. c. 90 §34A');
        act(() => norm.props.onPress());
        expect(open).toHaveBeenCalledWith('https://malegislature.gov/');
        open.mockRestore();
    });

    it('renders nothing for a null rule', () => {
        const tree = render(<RuleClauseList rule={null} accessibilityLabel="Seguro" />);
        expect(tree.root.findAll((node) => node.props.role === 'list')).toHaveLength(0);
        expect(tree.root.findAllByType(List.Item)).toHaveLength(0);
    });
});
