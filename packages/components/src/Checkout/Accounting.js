import React from 'react';

import { List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List';

const feesListItem = (fees) => {
    const results = [];

    for (const index in fees) {
        if (Array.isArray(fees[index])) {
            results.push(feesListItem(fees[index]));
        } else {
            results.push(
                <JMSList.Item
                    title={fees[index].label}
                    description={fees[index].description}
                    metaTitle={fees[index].formattedValue}
                    metaTitleStyle={{color: MD3LightTheme.colors.onSurface}}
                    {...(index === "total" ? 
                        {titleVariant: "headlineSmall", metaTitleVariant: "headlineSmall"} : 
                        {style: {paddingVertical: 0}}
                    )} />
            )
        }
    }

    return results;
};

const Accounting = ({ fees }) => (
    <List.Section>
        {feesListItem(fees)}
    </List.Section>
)

export default Accounting;
