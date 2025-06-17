import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from '../List/List';

import { calculatableAccoutingList } from '@jmstechnologiesinc/cart';
import { localized } from '../Localization/Localization';


const isTranslatePlatformCommission = (title) => {

  const functionPatterns = [
    {
        regex: /^platformCommission(\(.*?\))$/,  
        key: 'platformCommission',
        paramName: 'percentage'  
    },
    {
        regex: /^distanceRatePerMile(\(.*?\))$/,
        key: 'distanceRatePerMile',
        paramName: 'percentage'  
    },
    {
        regex: /^durationRatePerMinute(\(.*?\))$/,
        key: 'durationRatePerMinute',
        paramName: 'percentage'  
    }
];

    for (const pattern of functionPatterns) {
        const match = title.match(pattern.regex);
        if (match) {
            const paramValue = match[1];
            const params = { [pattern.paramName]: paramValue };
            return localized(pattern.key, params);
        }
    }

    return localized(title);
}
const Accounting = ({ feeList, isLocalized = true }) => {
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
}

export default Accounting;
