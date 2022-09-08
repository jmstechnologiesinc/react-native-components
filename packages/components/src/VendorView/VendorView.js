import React, { useState } from 'react';

import { View, Animated } from 'react-native';

import { Text, List, Paragraph, Banner } from '@jmsstudiosinc/react-native-paper';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import ToggleButtonList from '../ToggleButton/ToggleButtonList';

const VendorView = ({
    title,
    photos,
    description,
    formattedAddress,
    formattedPud,
    pud,
    selectedPud,
    banner = null,
    coverTranslateY,
    coverScale,
    onPressPudFilter,
}) => {
    const [isBannerVisible, setIsBannerVisible] = useState(!!banner);

    const renderTitle = ({ selectable, titleEllipsizeMode, color }) => (
        <>
            <Text variant="labelSmall">{formattedPud}</Text>
            <Text
                selectable={selectable}
                ellipsizeMode={titleEllipsizeMode}
                numberOfLines={1}
                variant={'headlineSmall'}
                style={{ color }}
            >
                {title}
            </Text>
        </>
    );

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
            <List.Section>
                <List.Item title={renderTitle} description={formattedAddress} />
            </List.Section>
            {description && (
                <View style={{ marginHorizontal: 16, marginBottom: 32 }}>
                    <Paragraph>{description}</Paragraph>
                </View>
            )}

            {pud && (
                <ToggleButtonList
                    title="Available Shopping Mode"
                    data={pud}
                    selectedIndex={selectedPud}
                    onPress={onPressPudFilter}
                />
            )}
        </>
    );
};

export default VendorView;
