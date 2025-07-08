import React from 'react';

import { Card, Text, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmstechnologiesinc/vendor';
import { interpunct, getMainPhoto } from '@jmstechnologiesinc/commons';
import { sectionPaddings } from '../ScreenWrapper/ScreenWrapperSection';
import { imageKitCard, imageKitCardLqip, isPublicUrl } from '../utils';
import { localized } from '../Localization/Localization';

const VendorListItem = ({ item, withPaddingHorizontal, onPress }) => {
    
    const mainPhoto = getMainPhoto(item.photos);
    const isPublic = isPublicUrl(mainPhoto);

    return (
        <Card
            style={{
                marginVertical: MD3LightTheme.spacing.x1,
                ...(withPaddingHorizontal ? { marginHorizontal: sectionPaddings.left } : null),
            }}
            onPress={() => onPress(item)}
        >
            <Card.Cover
                source={{
                    lqipUri: isPublic ? mainPhoto : imageKitCardLqip(item.photos),
                    uri: isPublic ? mainPhoto : imageKitCard(item.photos),
                }}
            />

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
    );
};

export default VendorListItem;
