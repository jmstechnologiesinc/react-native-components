import React from 'react';

import {  Banner, MD3LightTheme, Card, Text, TouchableRipple } from '@jmsstudiosinc/react-native-paper';

import PhotoGallery from '../PhotoGallery/PhotoGallery';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';
import { interpunct } from '@jmsstudiosinc/commons';

import IndustryList from '../IndustryList/IndustryList';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const VendorView = ({
    title,
    onLayoutTitleOffsetY,
    photos,
    formattedAddress,
    formattedPub,
    formattedHitDistance,
    fulfillmentMethodTitle,
    industryTitle,
    fulfillmentMethodOptions,
    selectedFulfillmentMethod,
    onPressPudFilter,
    formattedErrors = [],
    industryList,
    industryFilter,
    onPressIndustryFilter,
    onPressVendorOverview,
}) => {
    return (
        <>
            {formattedErrors ? (
                <Banner 
                    visible={true} 
                    actions={[]} 
                    style={{ marginBottom: MD3LightTheme.spacing.x2 }}
                    elevation={1}>
                    {formattedErrors}
                </Banner>
            ) : null}

            <PhotoGallery photos={photos} />

            <TouchableRipple 
                onPress={onPressVendorOverview} 
                onLayout={onLayoutTitleOffsetY ? (event) => onLayoutTitleOffsetY(event.nativeEvent.layout.y) : null}
                style={{paddingBottom: MD3LightTheme.spacing.x2}}>
                <>
                    <Card.Title
                        title={title}
                        subtitle={interpunct([formattedPub, formattedHitDistance])}
                        titleVariant="headlineMedium"
                        subtitleVariant="bodyLarge"
                        titleNumberOfLines={0}
                       
                    />
                    <Card.Content>
                        <Text variant="bodyMedium">
                            {formattedAddress}
                        </Text>
                    </Card.Content>
                </>
            </TouchableRipple>
          
            {industryList && (
                <ScreenWrapper.Section title={industryTitle} withPaddingHorizontal>
                    <IndustryList data={industryList} onPress={onPressIndustryFilter} value={industryFilter} />
                </ScreenWrapper.Section>
            )}

            {fulfillmentMethodOptions?.length > 0 && (
                <ScreenWrapper.Section 
                    title={fulfillmentMethodTitle}
                    withPaddingHorizontal>
                    <SegmentedButtonGroup
                        data={fulfillmentMethodOptions}
                        value={selectedFulfillmentMethod}
                        onPress={onPressPudFilter}
                        density="high" />
                </ScreenWrapper.Section>
            )}
            <ScreenWrapper.Section />
        </>
    );
};

VendorView.whyDidYouRender = true;

export default VendorView;
