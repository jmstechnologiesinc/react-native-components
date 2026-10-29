jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { List, MD3LightTheme, Provider, RadioButton } from '@jmstechnologiesinc/react-native-paper';

import CheckRadio from '../../List/CheckRadio';
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

const listItems = (tree) =>
    tree.root.findAll((node) => typeof node.type === 'string' && node.props.role === 'listitem');

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
        expect(listItems(tree)).toHaveLength(0);
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
        // The host rows, as a screen reader meets them (review MD-1): one element each, the selected one so named.
        const rows = listItems(tree);
        expect(rows.map((row) => [row.props.accessible, row.props.accessibilityLabel])).toEqual([
            [true, 'Daily'],
            [true, 'Weekly, Every Monday, selected'],
            [true, 'Instant'],
        ]);
        expect(rows.map((row) => row.findAllByType(List.Icon).map((icon) => icon.props.icon))).toEqual([
            [],
            ['check'],
            [],
        ]);
        // No control, and nothing announced disabled — the unavailable `instant` included.
        const controls = tree.root.findAll(
            (node) =>
                typeof node.type === 'string' &&
                (node.props.onClick ||
                    node.props.onResponderRelease ||
                    node.props.accessibilityRole === 'button' ||
                    node.props.role === 'button' ||
                    node.props.accessibilityState?.disabled ||
                    node.props['aria-disabled'])
        );
        expect(controls.map((node) => node.type)).toEqual([]);
        expect(inputActionHandler).not.toHaveBeenCalled();
    });
});
