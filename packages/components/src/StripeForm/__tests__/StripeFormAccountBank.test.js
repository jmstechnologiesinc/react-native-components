// StripeForm.AccountBank shows the host's errors under their inputs, as the package's forms do, and validates
// nothing by itself: without `errors` it is the form it always was.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));
// The section frame alone: the package's ScreenWrapper entry also loads the camera's native modules.
jest.mock('../../ScreenWrapper', () => ({ __esModule: true, default: { Section: 'ScreenWrapper.Section' } }));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider, TextInput } from '@jmstechnologiesinc/react-native-paper';

import { setI18nConfig } from '../../Localization/Localization';
import AccountBank from '../StripeFormAccountBank';

jest.useFakeTimers();

const mounted = [];
const render = (props) => {
    let tree;
    act(() => {
        tree = renderer.create(
            <Provider theme={MD3LightTheme}>
                <AccountBank inputActionHandler={() => {}} {...props} />
            </Provider>
        );
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

const inputs = (tree) => tree.root.findAllByType(TextInput);
const errorLines = (tree) => tree.root.findAll((node) => typeof node.type === 'string' && /^error\./.test(node.props.testID));

describe('StripeForm.AccountBank', () => {
    it('marks no input and shows no error line without errors', () => {
        const tree = render({});

        expect(inputs(tree).map((input) => input.props.error)).toEqual([false, false, false, false]);
        expect(errorLines(tree)).toHaveLength(0);
    });

    it('shows each of the host\'s errors under its own input', () => {
        const tree = render({
            errors: [
                { field: 'routingNumber', code: 'invalid', message: 'Nine digits.' },
                { field: 'reenterAccountNumber', code: 'mismatch', message: 'They do not match.' },
            ],
        });

        expect(inputs(tree).map((input) => input.props.error)).toEqual([false, true, false, true]);
        expect(errorLines(tree).map((line) => line.props.testID)).toEqual([
            'error.routingNumber',
            'error.reenterAccountNumber',
        ]);
        expect(JSON.stringify(tree.toJSON())).toContain('Nine digits.');
    });
});
