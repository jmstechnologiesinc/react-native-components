import React from 'react';

import { Divider, MD3LightTheme, HelperText } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import Accounting from '../Accounting/Accounting';

const CheckoutSummary = ({ netFeeList = [], termsAndConditions }) => {
    if (!netFeeList.length) return null;

    return (
        <>
            <Divider style={{ marginTop: MD3LightTheme.spacing.x4 }} />
            <ScreenWrapper.Section>
                <Accounting feeList={netFeeList} style={{ marginTop: MD3LightTheme.spacing.x4 }} />
            </ScreenWrapper.Section>
            {termsAndConditions && (
                <ScreenWrapper.Section>
                    <HelperText>{localized(termsAndConditions)}</HelperText>
                </ScreenWrapper.Section>
            )}
        </>
    );
};

export default CheckoutSummary;
