import React from 'react';

import { Card, Text, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmstechnologiesinc/vendor';
import { interpunct } from '@jmstechnologiesinc/commons';
import { sectionPaddings } from '../ScreenWrapper/ScreenWrapperSection';
import { imageKitCard,imageKitCardLqip } from '../utils';
import { localized } from '../Localization/Localization';

const VendorListItem = ({ item, withPaddingHorizontal, onPress }) => {
    
    return (
        <Card
            style={{
                marginVertical: MD3LightTheme.spacing.x1,
                ...(withPaddingHorizontal ? { marginHorizontal: sectionPaddings.left } : null),
            }}
            onPress={() => onPress(item)}
        >
            <Card.Cover source={{
                lqipUri: imageKitCardLqip(item.photos),
                uri: imageKitCard(item.photos),
            }} />
            <Card.Title
                title={item.title}
                subtitle={interpunct([localized(item.formattedFulfillmentMethod), item.formattedHitDistance])}
                titleVariant="headlineSmall"
                subtitleVariant="bodyLarge"
            />
            {item.industries?.length > 0 ? (
                <Card.Content>
                    <Text variant="bodyMedium">
                        {interpunct(
                            item?.industries.map((industry) => localized(VENDOR_INDUSTRIES_MAPPING[industry].title))
                        )}
                    </Text>
                </Card.Content>
            ) : null}
        </Card>
    )
}

export default VendorListItem;
