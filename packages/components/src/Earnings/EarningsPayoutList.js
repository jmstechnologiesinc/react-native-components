import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';

import * as JMSList from '../List/List';
import { localized } from '../Localization/Localization';

/**
 * Transfers to the bank account, kept apart from the earnings on purpose: what was earned and what
 * was paid out are different things with different dates, and merging them hides the delay.
 *
 * Every field is display-ready — `label`, `description` and `formattedValue` come localized and
 * formatted from the backend, the same way `payment-getBalance` already returns them.
 */
const EarningsPayoutList = ({ payouts, onPress }) => {
    if (!payouts?.length) {
        return null;
    }

    return (
        <List.Section>
            <List.Subheader>{localized('payouts')}</List.Subheader>

            {payouts.map((payout) => (
                <JMSList.Item
                    key={payout.id}
                    title={payout.label}
                    description={payout.description}
                    metaTitle={payout.formattedValue}
                    onPress={onPress ? () => onPress(payout) : undefined}
                />
            ))}
        </List.Section>
    );
};

export default EarningsPayoutList;
