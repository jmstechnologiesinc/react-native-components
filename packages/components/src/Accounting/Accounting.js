import React from 'react';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';

import { calculatableAccoutingList } from '@jmstechnologiesinc/cart';
import { localized } from '../Localization/Localization';

const isTranslatePlatformCommission = (title) => {

const regex = /^platformCommission\((\d+%)\)$/;

const match = title.match(regex);

if (match) {
  const percentage = match[1];
  return localized('platformCommission', {percentage})
} else {
    return localized(title)
  
}

}
const feesListItem = (feeList) => {
    if (!feeList?.length) {
        return null;
    }
    console.log(JSON.stringify(MD3LightTheme.fonts.titleLarge.fontSize,null,2))

    const results = [];

    for (const feeItem of calculatableAccoutingList(feeList)) {
        const styles =
            feeItem.id === 'total'
                ? {
                      titleVariant: 'headlineSmall',
                      metaTitleVariant: 'labelLarge',
                      titleStyle: { color: MD3LightTheme.colors.onSurfaceVariant },
                      metaTitleStyle: { color: MD3LightTheme.colors.onSurface, lineHeight: MD3LightTheme.fonts.titleLarge.lineHeight, fontSize: MD3LightTheme.fonts.titleLarge.fontSize },
                  }
                : {
                      style: { paddingVertical: 0 },
                      titleStyle: { color: MD3LightTheme.colors.onSurface },
                  };

        results.push(
            <JMSList.Item
                key={feeItem.id}
                title={isTranslatePlatformCommission(feeItem.label)}
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
