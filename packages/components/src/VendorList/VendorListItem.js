import React from 'react';

import { Card, Text, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmstechnologiesinc/vendor';
import { interpunct } from '@jmstechnologiesinc/commons';
import { sectionPaddings } from '../ScreenWrapper/ScreenWrapperSection';
import { imagekitUrl } from '../utils';
import { localized } from '../Localization/Localization';
import FastImage from 'react-native-fast-image';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { PixelRatio } from 'react-native';

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
                    uri: imagekitUrl(`tr:h-${moderateScale(195)},q-100,pr-true,fo-auto,lo-true,dpr-${PixelRatio.get()}/${item.photos}`),
                    cache: FastImage.cacheControl.immutable,
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
