import React from 'react';

import { Card, Text, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmstechnologiesinc/vendor';
import { interpunct, getMainPhoto } from '@jmstechnologiesinc/commons';
import { imageKitCard, imageKitCardLqip, isPublicUrl } from '../utils';
import { localized } from '../Localization/Localization';

/**
 * One vendor's card in the feed (VendorList): `width` is its column's, which ImageKit sizes the photo to; `style` is
 * the list's layout for it (its side margins in a single column).
 */
const VendorListItem = ({ item, width, style, onPress }) => {
    const mainPhoto = getMainPhoto(item.photos);
    const isPublic = isPublicUrl(mainPhoto);

    return (
        <Card style={[{ marginVertical: MD3LightTheme.spacing.x1, width }, style]} onPress={() => onPress(item)}>
            <Card.Cover
                source={{
                    lqipUri: isPublic ? mainPhoto : imageKitCardLqip(item.photos, width),
                    uri: isPublic ? mainPhoto : imageKitCard(item.photos, width),
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
