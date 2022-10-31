import React from 'react';

import { List, Banner, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';

import IndustryList from '../IndustryList/IndustryList';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

const VendorView = ({
    title,
    photos,
    description,
    formattedAddress,
    formattedPud,
    pudTitle,
    industryTitle,
    pudOptions,
    selectedPud,
    onPressPudFilter,
    bannerMessages = [],
    industryList,
    industryFilter,
    onPressIndustryFilter,
    onNavigateVendorOverview,
}) => {
    return (
        <>
            {bannerMessages.length > 0 && (
                <Banner
                    visible={true}
                    actions={[]}
                    icon="alert-circle"
                    style={{ marginBottom: MD3LightTheme.spacing.xxxSmall }}
                >
                    {bannerMessages.join(', ')}
                </Banner>
            )}

            <PhotoGallery photos={photos} />

            <JMSList.Item
                overline={formattedPud}
                title={title}
                description={formattedAddress}
                titleVariant={'headlineSmall'}
                right={() => <List.Icon icon="chevron-right" style={{ height: 'auto' }} />}
                onPress={onNavigateVendorOverview}
                style={{ paddingBottom: 0 }}
            />

            {description && <List.Item title={description} />}

            {industryList && (
                <ScreenWrapper.Section title={industryTitle} withPaddingHorizontal>
                    <IndustryList data={industryList} onPress={onPressIndustryFilter} value={industryFilter} />
                </ScreenWrapper.Section>
            )}

            {pudOptions && (
                <ScreenWrapper.Section title={pudTitle} withPaddingHorizontal>
                    <SegmentedButtonGroup data={pudOptions} value={selectedPud} onPress={onPressPudFilter} />
                </ScreenWrapper.Section>
            )}
            <ScreenWrapper.Section />
        </>
    );
};

export default VendorView;
