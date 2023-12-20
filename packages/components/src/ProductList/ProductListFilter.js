import React from 'react';

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import IndustryList from '../IndustryList/IndustryList';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';
import {Divider,MD3LightTheme} from "@jmstechnologiesinc/react-native-paper";

const ProductListFilter = ({
    industryTitle,
    industryList,
    industryFilter,
    fulfillmentMethodTitle,
    fulfillmentMethodOptions,
    selectedFulfillmentMethod,
    onPressIndustryFilter,
    onPressFulfillmentMethodFilter
}) => {
   
    return <>
        <Divider style={{ marginTop: MD3LightTheme.spacing.x2 }} />
        {industryList && (
            <ScreenWrapper.Section title={industryTitle} withPaddingHorizontal>
                <IndustryList
                    data={industryList}
                    onPress={onPressIndustryFilter}
                    value={industryFilter}
                />
            </ScreenWrapper.Section>
        )}

        {fulfillmentMethodOptions?.length > 0 && (
            <ScreenWrapper.Section title={fulfillmentMethodTitle} withPaddingHorizontal>
                <SegmentedButtonGroup
                    data={fulfillmentMethodOptions}
                    value={selectedFulfillmentMethod}
                    onPress={onPressFulfillmentMethodFilter}
                    density="high"
                />
            </ScreenWrapper.Section>
        )}
        <ScreenWrapper.Section />
    </>
};

export default ProductListFilter;
