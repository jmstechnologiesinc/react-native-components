import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import { expect, it } from '@jest/globals';

import Localization from './Localization';

describe('<Localization />', () => {
    it('setI18nConfig || change Language ', () => {
        const { getByText } = render(<Localization />);
        const profile = getByText(/Update Profile/i);
        expect(profile).not.toBeNull();
        expect(profile).toBeTruthy();

        const settings = getByText(/Settings/i);
        expect(settings).toBeTruthy();
    });
});
