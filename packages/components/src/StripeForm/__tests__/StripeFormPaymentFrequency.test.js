jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, RadioButton } from '@jmstechnologiesinc/react-native-paper';

import CheckRadio from '../../List/CheckRadio';
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

    it('readOnly: every option disabled and nothing reported', () => {
        const inputActionHandler = jest.fn();
        const tree = render(
            <PaymentFrequency
                options={OPTIONS}
                selectedInterval="weekly"
                readOnly
                inputActionHandler={inputActionHandler}
            />
        );
        const rows = tree.root.findAllByType(CheckRadio);
        expect(rows.every((row) => row.props.isDisabled === true)).toBe(true);
        expect(tree.root.findAllByType(RadioButton.Android).map((radio) => radio.props.status)).toEqual([
            'unchecked',
            'checked',
            'unchecked',
        ]);
        act(() => rows[0].props.onPress());
        expect(inputActionHandler).not.toHaveBeenCalled();
    });
});
