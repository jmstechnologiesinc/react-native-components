jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { List, MD3LightTheme, Provider, RadioButton } from '@jmstechnologiesinc/react-native-paper';

import CheckRadio from '../../List/CheckRadio';
import ListRow from '../../ListRow/ListRow';
import { setI18nConfig } from '../../Localization/Localization';
import PaymentFrequency from '../StripeFormPaymentFrequency';

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

const OPTIONS = [
    { interval: 'daily', title: 'Daily' },
    { interval: 'weekly', title: 'Weekly', description: 'Every Monday' },
    { interval: 'instant', title: 'Instant', disabled: true },
];

describe('StripeForm.PaymentFrequency', () => {
    it('without readOnly: the options it is given, the selected one checked, a press reports the interval', () => {
        const inputActionHandler = jest.fn();
        const tree = render(
            <PaymentFrequency options={OPTIONS} selectedInterval="weekly" inputActionHandler={inputActionHandler} />
        );
        const rows = tree.root.findAllByType(CheckRadio);
        expect(rows.map((row) => [row.props.isChecked, row.props.isDisabled])).toEqual([
            [false, undefined],
            [true, undefined],
            [false, true],
        ]);
        act(() => rows[0].props.onPress());
        expect(inputActionHandler).toHaveBeenCalledWith('interval', 'daily');
    });

    it('without readOnly: the radios, the selected one checked', () => {
        const tree = render(
            <PaymentFrequency options={OPTIONS} selectedInterval="weekly" inputActionHandler={() => {}} />
        );
        expect(tree.root.findAllByType(RadioButton.Android).map((radio) => radio.props.status)).toEqual([
            'unchecked',
            'checked',
            'unchecked',
        ]);
        expect(tree.root.findAllByType(ListRow)).toHaveLength(0);
    });

    // Alta y consola plan 2.9: the payout interval shown, not chosen — rows with a check, no greyed radios.
    it('readOnly: every option a row in a named list, a check on the selected one, nothing to press or report', () => {
        const inputActionHandler = jest.fn();
        const tree = render(
            <PaymentFrequency
                options={OPTIONS}
                selectedInterval="weekly"
                readOnly
                accessibilityLabel="Payout frequency"
                inputActionHandler={inputActionHandler}
            />
        );
        expect(tree.root.findAllByType(CheckRadio)).toHaveLength(0);
        expect(tree.root.findAllByType(RadioButton.Android)).toHaveLength(0);
        const list = tree.root.find((node) => typeof node.type === 'string' && node.props.role === 'list');
        expect(list.props['aria-label']).toBe('Payout frequency');
        const rows = tree.root.findAllByType(ListRow);
        expect(rows.map((row) => [row.props.title, row.props.description, Boolean(row.props.trailing)])).toEqual([
            ['Daily', undefined, false],
            ['Weekly', 'Every Monday', true],
            ['Instant', undefined, false],
        ]);
        expect(rows[1].findAllByType(List.Icon)[0].props.icon).toBe('check');
        expect(rows.map((row) => row.props.accessibilityLabel)).toEqual([
            undefined,
            'Weekly, Every Monday, selected',
            undefined,
        ]);
        expect(rows.every((row) => row.props.onPress === undefined)).toBe(true);
        expect(inputActionHandler).not.toHaveBeenCalled();
    });
});
