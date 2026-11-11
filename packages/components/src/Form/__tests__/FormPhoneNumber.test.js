// Form.PhoneNumber asks for a number by default; `readOnly` shows the one it is given (the app's step-up sends its
// code to the account's own phone): no typing, and the flag opens no country list.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));
jest.mock('@jmstechnologiesinc/react-native-phone-input', () => ({ PhoneInput: 'PhoneInput' }));
jest.mock('../FormVerificationCode', () => 'FormVerificationCode');
jest.mock('../CountryPicker', () => 'CountryPicker');
// The section frame alone: the package's ScreenWrapper entry also loads the camera's native modules.
jest.mock('../../ScreenWrapper', () => ({ __esModule: true, default: { Section: 'ScreenWrapper.Section' } }));

import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MD3LightTheme, Provider } from '@jmstechnologiesinc/react-native-paper';

import FormPhoneNumber from '../FormPhoneNumber';

const phoneInputOf = (props) => {
    let tree;
    act(() => {
        tree = renderer.create(
            <Provider theme={MD3LightTheme}>
                <FormPhoneNumber value="+15555550100" showSubmitButton={false} onChangeText={() => {}} {...props} />
            </Provider>
        );
    });
    const { props: phoneInput } = tree.root.findByType('PhoneInput');
    act(() => tree.unmount());
    return phoneInput;
};

describe('Form.PhoneNumber', () => {
    it('asks for the number by default: it can be typed and its country chosen', () => {
        const phoneInput = phoneInputOf();

        expect(phoneInput.disabled).toBe(false);
        expect(typeof phoneInput.onPressFlag).toBe('function');
    });

    it('only shows the number when read-only', () => {
        const phoneInput = phoneInputOf({ readOnly: true });

        expect(phoneInput.disabled).toBe(true);
        expect(phoneInput.onPressFlag).toBeUndefined();
        expect(phoneInput.initialValue).toBe('+15555550100');
    });
});
