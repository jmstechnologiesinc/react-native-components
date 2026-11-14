// Form.EmailPassword places the host's line under the email (the app's profile says why a social sign-in's address
// cannot be changed there), inside the email's own section, as the business form places its helper texts.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));
// The section frame alone: the package's ScreenWrapper entry also loads the camera's native modules.
jest.mock('../../ScreenWrapper', () => ({ __esModule: true, default: { Section: 'ScreenWrapper.Section' } }));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { HelperText, MD3LightTheme, Provider, TextInput } from '@jmstechnologiesinc/react-native-paper';

import FormEmailPassword from '../FormEmailPassword';

// Paper's HelperText animates its entrance: its timers run inside the test, as the inputs' own suite runs them.
jest.useFakeTimers();

const LINE = "This email comes from your Google account and can't be changed here.";

const emailSectionOf = (props) => {
    let tree;
    act(() => {
        tree = renderer.create(
            <Provider theme={MD3LightTheme}>
                <FormEmailPassword
                    email="ada@example.com"
                    showPasswordInput={false}
                    showConfirmPasswordInput={false}
                    inputActionHandler={() => {}}
                    {...props}
                />
            </Provider>
        );
    });
    const [section] = tree.root.findAllByType('ScreenWrapper.Section');
    const helperTexts = section.findAllByType(HelperText).map((helperText) => helperText.props.children);
    const { disabled } = section.findByType(TextInput).props;
    act(() => {
        tree.unmount();
        jest.runOnlyPendingTimers();
    });
    return { helperTexts, disabled };
};

describe('Form.EmailPassword', () => {
    it('shows no line under the email by default', () => {
        expect(emailSectionOf().helperTexts).toEqual([]);
    });

    it('shows the host’s line under the email, in its section', () => {
        const { helperTexts, disabled } = emailSectionOf({ isEmailDisabled: true, emailHelperText: LINE });

        expect(helperTexts).toEqual([LINE]);
        expect(disabled).toBe(true);
    });
});
