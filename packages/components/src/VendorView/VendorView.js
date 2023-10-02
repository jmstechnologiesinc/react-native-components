import React, { useState } from 'react';

import { Banner, MD3LightTheme, Card, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import PhotoGallery from '../PhotoGallery/PhotoGallery';

const VendorView = ({
    title,
    onLayoutTitleOffsetY,
    photos,
    formattedAddress,
    formattedHitDistance,
    formattedErrors = [],
    onPressVendorOverview,
}) => {

    const [selectedPhoto, setSelectedPhoto] = useState();

    const onPress = (index) => {
        setSelectedPhoto(index);
    };
    return (
        <>
            {formattedErrors ? (
                <Banner visible={true} actions={[]} style={{ marginBottom: MD3LightTheme.spacing.x2 }} elevation={1}>
                    {formattedErrors}
                </Banner>
            ) : null}

            <PhotoGallery photos={photos}  onPress={onPress} selectedPhoto={selectedPhoto}/>

            <TouchableRipple
                onPress={onPressVendorOverview}
                onLayout={onLayoutTitleOffsetY ? (event) => onLayoutTitleOffsetY(event.nativeEvent.layout.y) : null}
                style={{ paddingBottom: MD3LightTheme.spacing.x2 }}
            >
                <>
                    {formattedHitDistance ? (
                        <Card.Title
                            title={title}
                            subtitle={formattedHitDistance}
                            titleVariant="headlineMedium"
                            subtitleVariant="bodyLarge"
                            titleNumberOfLines={0}
                        />
                    ) : null}
                    <Card.Content>
                        <Text variant="bodyMedium">{formattedAddress}</Text>
                    </Card.Content>
                </>
            </TouchableRipple>
        </>
    );
};

VendorView.whyDidYouRender = false;

export default VendorView;
