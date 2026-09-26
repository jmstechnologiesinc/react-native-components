jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { HelperText, MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import { ChangedHelperText, FieldErrorList, FieldErrorText } from '../FormField';

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

beforeAll(() => setI18nConfig());

// The HOST node of a testID: what a screen reader reads.
const hostOf = (tree, testID) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.testID === testID)[0];

const textOf = (tree) => JSON.stringify(tree.toJSON());

const ERRORS = [
    { field: 'licensePlateNumber', code: 'mismatch' },
    { field: 'make', code: 'required', message: 'Make is required' },
    { code: 'duplicate_partner' },
];

const linesOf = (tree) => tree.root.findAllByType(HelperText).map((line) => line.props.children);

describe('the form field helpers', () => {
    it('ChangedHelperText says «Changed» only when visible', () => {
        expect(textOf(render(<ChangedHelperText visible />))).toContain('Changed');
        expect(linesOf(render(<ChangedHelperText visible={false} />))).toEqual([]);
    });

    it('FieldErrorText shows the errors of one field, message else code', () => {
        const tree = render(<FieldErrorText field="make" errors={ERRORS} />);
        expect(linesOf(tree)).toEqual(['Make is required']);
        expect(hostOf(tree, 'error.make')).toBeDefined();
    });

    it('FieldErrorList shows every error, one line each, form-level ones included', () => {
        const tree = render(<FieldErrorList errors={ERRORS} />);
        expect(linesOf(tree)).toEqual(['mismatch', 'Make is required', 'duplicate_partner']);
        expect(hostOf(tree, 'field-errors.form')).toBeDefined();
        expect(hostOf(tree, 'field-errors.licensePlateNumber')).toBeDefined();
    });

    it('FieldErrorList leaves out the excluded fields and prefixes the field’s label', () => {
        const tree = render(
            <FieldErrorList
                errors={ERRORS}
                exclude={['make']}
                fieldLabel={(field) => (field === 'licensePlateNumber' ? 'Plate' : field)}
            />
        );
        expect(linesOf(tree)).toEqual(['Plate: mismatch', 'duplicate_partner']);
    });

    it('FieldErrorList renders nothing when no error remains', () => {
        for (const element of [
            <FieldErrorList key="empty" errors={[]} />,
            <FieldErrorList key="absent" />,
            <FieldErrorList key="excluded" errors={[ERRORS[1]]} exclude={['make']} />,
        ]) {
            const tree = render(element);
            expect(hostOf(tree, 'field-errors')).toBeUndefined();
            expect(linesOf(tree)).toEqual([]);
        }
    });
});
