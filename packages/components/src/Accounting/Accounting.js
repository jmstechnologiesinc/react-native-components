import React from 'react';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';

import { calculatableAccoutingList } from '@jmstechnologiesinc/cart';

const feesListItem = (feeList) => {
    if (!feeList?.length) {
        return null;
    }

    const results = [];

    for (const feeItem of calculatableAccoutingList(feeList)) {
        const styles =
            feeItem.id === 'total'
                ? {
                      titleVariant: 'headlineSmall',
                      metaTitleVariant: 'headlineSmall',
                      titleStyle: { color: MD3LightTheme.colors.onSurfaceVariant },
                      metaTitleStyle: { color: MD3LightTheme.colors.onSurface },
                  }
                : {
                      style: { paddingVertical: 0 },
                      titleStyle: { color: MD3LightTheme.colors.onSurface },
                      metaTitleStyle: { color: MD3LightTheme.colors.onSurfaceVariant },
                  };

        results.push(
            <JMSList.Item
                key={feeItem.id}
                title={feeItem.label}
                description={feeItem.description}
                metaTitle={feeItem.formattedValue}
                {...styles}
            />
        );
    }

    return results;
};

const Accounting = ({ feeList }) => feesListItem(feeList);

export default Accounting;
