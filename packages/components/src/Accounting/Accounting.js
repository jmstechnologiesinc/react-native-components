import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';

import { calculatableAccoutingList } from '@jmstechnologiesinc/cart';
import { localized } from '../Localization/Localization';

const localizeWithParam = (title) => {
    const regex = /^(\w+)\((.+)\)$/;
    const match = title.match(regex);
    if (match) {
        const key = match[1];
        const param = match[2];
        return `${localized(key)}(${param})`;
    } else {
        return localized(title);
    }
};
const Accounting = ({ feeList }) => {
    if (!feeList?.length) {
        return null;
    }

    const results = [];

    for (const feeItem of calculatableAccoutingList(feeList)) {
        const styles =
            feeItem.id === 'total'
                ? {
                      titleVariant: 'headlineSmall',
                      metaTitleVariant: 'labelLarge',
                      titleStyle: { color: MD3LightTheme.colors.onSurfaceVariant },
                      metaTitleStyle: {
                          color: MD3LightTheme.colors.onSurface,
                          lineHeight: MD3LightTheme.fonts.titleLarge.lineHeight,
                          fontSize: MD3LightTheme.fonts.titleLarge.fontSize,
                      },
                  }
                : {
                      style: { paddingVertical: 0 },
                      titleStyle: { color: MD3LightTheme.colors.onSurface },
                  };

        results.push(
            <JMSList.Item
                key={feeItem.id}
                title={localizeWithParam(feeItem.label)}
                description={feeItem.description}
                metaTitle={feeItem.formattedValue}
                {...styles}
            />
        );
    }

    return results;
};

export default Accounting;
