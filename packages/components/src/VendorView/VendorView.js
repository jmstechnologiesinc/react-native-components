import React, { useState } from 'react';

import { View, Animated } from 'react-native';

import { List, Paragraph, Banner } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';
import { IndustryTabs, Catalog } from '../index';

const VendorView = ({
    title,
    photos,
    description,
    formattedAddress,
    formattedPud,
    pudOptions,
    selectedPud,
    onPressPudFilter,
    banner = null,
    coverTranslateY,
    coverScale,
    onPressPudFilter,
    industryList,
    onPressIndustryFilter,
    currentIndex,
    catalog,
    setCatalogFilter,
    catalogFilter,
    isMultiProducts,
    openVendorOverview,
}) => {
    const [isBannerVisible, setIsBannerVisible] = useState(!!banner);

    return (
        <>
            {banner && (
                <Banner
                    visible={isBannerVisible}
                    actions={[{ label: 'Close', onPress: () => setIsBannerVisible(!isBannerVisible) }]}
                    style={{ marginBottom: isBannerVisible ? 16 : 0 }}
                >
                    {banner}
                </Banner>
            )}
            {coverTranslateY && coverScale ? (
                <Animated.View
                    style={[
                        {
                            maxHeight: 200,
                        },
                        {
                            transform: [
                                {
                                    translateY: coverTranslateY,
                                },
                            ],
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            {
                                transform: [
                                    {
                                        scale: coverScale,
                                    },
                                ],
                            },
                        ]}
                    >
                        <PhotoGallery photos={photos} />
                    </Animated.View>
                </Animated.View>
            ) : (
                <PhotoGallery photos={photos} />
            )}

            <List.Section>
                <JMSList.Item
                    overline={formattedPud}
                    title={title}
                    description={formattedAddress}
                    titleVariant={'headlineSmall'}
                    onPress={() => openVendorOverview()}
                />
            </List.Section>

            {description && (
                <View style={{ marginHorizontal: 16, marginBottom: 32 }}>
                    <Paragraph>{description}</Paragraph>
                </View>
            )}

            {pudOptions && (
                <SegmentedButtonGroup
                    title="Available Shopping Mode"
                    data={pudOptions}
                    value={selectedPud}
                    onPress={onPressPudFilter}
                />
            )}

            {industryList && (
                <IndustryTabs
                    title="Industries"
                    data={industryList}
                    onPress={onPressIndustryFilter}
                    selectedIndex={currentIndex}
                />
            )}
            {isMultiProducts === true && (
                <Catalog data={catalog} selectedIndex={catalogFilter} setCatalogFilter={setCatalogFilter} />
            )}
        </>
    );
};

export default VendorView;
