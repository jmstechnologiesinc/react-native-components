import React from 'react';

import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import * as JMSList from '../List/List';

const feesListItem = (fees) => {
    const results = [];

    for (const index in fees) {
        if (Array.isArray(fees[index])) {
           results.push(...feesListItem(fees[index]));
        } else {
            const styles = index === "total" ? {
                titleVariant: "headlineSmall", 
                metaTitleVariant: "headlineSmall", 
                titleStyle: {color: MD3LightTheme.colors.onSurfaceVariant}, 
                metaTitleStyle: {color: MD3LightTheme.colors.onSurface}
            } : {
                style: {paddingVertical: 0},
                titleStyle: {color: MD3LightTheme.colors.onSurface}, 
                metaTitleStyle: {color: MD3LightTheme.colors.onSurfaceVariant}
            };
            
            results[fees[index].position] = <JMSList.Item
                title={fees[index].label}
                description={fees[index].description}
                metaTitle={fees[index].formattedValue}
                {...styles} />
        }
    }

    return results;
};

const Accounting = ({fees}) => feesListItem(fees);

export default Accounting;
