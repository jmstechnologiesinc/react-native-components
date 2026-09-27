jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Paragraph, Provider } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import DriverInfo from '../FormDriverInfo';

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

// C-25 on the driver form: `readOnly`, `highlightFields` and `errors`, keyed by
// the names it reports (`licenseNumer`, `dateofBirth`, `ssn`). Its rendering
// without them is pinned by `__tests__/legacyRendering.test.js`.
const DRIVER = { licenseNumer: 'D1234567', ssn: '123456789', inputActionHandler: () => {} };

/** The props the form gives its date field. */
const dateField = (tree) => tree.root.findAll((node) => node.props.field === 'dateofBirth')[0].props;

const inputWithValue = (tree, value) =>
    tree.root.findAll((node) => node.type === 'TextInput' && node.props.value === value)[0];

describe('Form.DriverInfo', () => {
    it('keeps the disclosure and every field editable without the new props', () => {
        const tree = render(<DriverInfo {...DRIVER} />);
        expect(tree.root.findAllByType(Paragraph)).toHaveLength(1);
        expect(inputWithValue(tree, 'D1234567').props.editable).toBe(true);
        expect(inputWithValue(tree, '123456789').props.editable).toBe(true);
    });

    it('locks every field, shows the date it is given and drops the disclosure under readOnly', () => {
        const tree = render(<DriverInfo {...DRIVER} dateOfBirth="01/02/90" readOnly />);
        expect(tree.root.findAllByType(Paragraph)).toHaveLength(0);
        for (const value of ['D1234567', '01/02/90', '123456789']) {
            expect(`${value}:${inputWithValue(tree, value).props.editable}`).toBe(`${value}:false`);
        }
        // The secrets stay masked: a disabled input offers no «show» toggle.
        expect(inputWithValue(tree, '123456789').props.secureTextEntry).toBe(true);
        // The date's entry aids describe typing: a locked field is given none.
        const date = dateField(tree);
        expect(['placeholder', 'keyboardType', 'maxLength'].filter((prop) => prop in date)).toEqual([]);
    });

    it('keeps the date field’s entry aids while editable', () => {
        const date = dateField(render(<DriverInfo {...DRIVER} />));
        expect([date.placeholder, date.keyboardType, date.maxLength]).toEqual(['MM/DD/YY', 'numeric', 10]);
    });

    it('marks the highlighted fields and shows the server errors under theirs', () => {
        const tree = render(
            <DriverInfo
                {...DRIVER}
                readOnly
                highlightFields={['ssn']}
                errors={[{ field: 'licenseNumer', code: 'expired', message: 'License expired' }]}
            />
        );
        expect((textOf(tree).match(/"Changed"/g) || []).length).toBe(1);
        expect(hostOf(tree, 'error.licenseNumer')).toBeDefined();
        expect(textOf(tree)).toContain('License expired');
    });

    it('reports typing under the same names as before', () => {
        const inputActionHandler = jest.fn();
        const tree = render(<DriverInfo {...DRIVER} inputActionHandler={inputActionHandler} />);
        act(() => inputWithValue(tree, 'D1234567').props.onChangeText('D7654321'));
        expect(inputActionHandler).toHaveBeenCalledWith('licenseNumer', 'D7654321');
    });

    it('drops the SSN field with showSsn={false} and shows a server-masked licence as it arrives', () => {
        const tree = render(
            <DriverInfo
                licenseNumer="•••• 4567"
                dateOfBirth="1990 · 35–44"
                readOnly
                showSsn={false}
                secureLicenseNumber={false}
            />
        );
        expect(textOf(tree)).not.toContain('socialSecurityNumber');
        expect(tree.root.findAll((node) => node.type === 'TextInput')).toHaveLength(2);
        expect(inputWithValue(tree, '•••• 4567').props.secureTextEntry).toBe(false);
        expect(inputWithValue(tree, '•••• 4567').props.editable).toBe(false);
        expect(inputWithValue(tree, '1990 · 35–44')).toBeDefined();
    });

    it('keeps the licence secure and the SSN field by default', () => {
        const tree = render(<DriverInfo {...DRIVER} />);
        expect(inputWithValue(tree, 'D1234567').props.secureTextEntry).toBe(true);
        expect(tree.root.findAll((node) => node.type === 'TextInput')).toHaveLength(3);
    });
});
