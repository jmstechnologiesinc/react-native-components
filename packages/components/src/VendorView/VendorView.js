import React from 'react';

import {  Banner, MD3LightTheme, Card, Text, IconButton, TouchableRipple } from '@jmsstudiosinc/react-native-paper';

import PhotoGallery from '../PhotoGallery/PhotoGallery';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';
import { interpunct, MATERIAL_ICONS } from '@jmsstudiosinc/commons';

import IndustryList from '../IndustryList/IndustryList';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const VendorView = ({
    title,
    onLayoutTitleOffsetY,
    photos,
    formattedAddress,
    formattedPub,
    formattedHitDistance,
    pudTitle,
    industryTitle,
    pudOptions,
    selectedPud,
    onPressPudFilter,
    bannerMessages = [],
    industryList,
    industryFilter,
    onPressIndustryFilter,
    onPressVendorOverview,
}) => {
    return (
        <>
            {bannerMessages.length > 0 && (
                <Banner 
                    visible={true} 
                    actions={[]} 
                    icon="alert-circle" 
                    style={{ marginBottom: MD3LightTheme.spacing.x4 }}>
                    {bannerMessages.join(', ')}
                </Banner>
            )}

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
                        titleNumberOfLines={5}
                        right={(props) => (
                            <IconButton {...props} icon={MATERIAL_ICONS.chevron} />
                        )}
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

            {pudOptions && (
                <ScreenWrapper.Section 
                    title={pudTitle}
                    withPaddingHorizontal>
                    <SegmentedButtonGroup
                        data={pudOptions}
                        value={selectedPud}
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
