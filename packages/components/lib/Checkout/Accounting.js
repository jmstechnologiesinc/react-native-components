import React from 'react';

import { List } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List';

const feeItem = ({ label, description, formattedValue }) => (
    <JMSList.Item
        style={{ paddingVertical: 0 }}
        title={label}
        description={description}
        metaTitle={formattedValue}
    />
);

const Accounting = ({ fees }) => {
    const results = [];

    const { total, ...rest } = fees;

    for (const index in rest) {
        if (Array.isArray(rest[index])) {
            results.push(rest[index].map(feeItem));
        }

        results.push(feeItem(rest[index]));
    }

    return (
        <List.Section>
            {total && (
                <JMSList.Item
                    title={total.label}
                    description={total.description}
                    metaTitle={total.formattedValue}
                    titleVariant="headlineSmall"
                    metaTitleVariant="headlineSmall" />
            )}

            {results}
        </List.Section>
    );
};

export default Accounting;
