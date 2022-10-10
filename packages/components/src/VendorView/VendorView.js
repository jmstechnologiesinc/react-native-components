import React from 'react';

import { View } from 'react-native';

import { List, Banner } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import SegmentedButtonGroup from '../SegmentedButtonGroup/SegmentedButtonGroup';

import IndustryList from '../IndustryList/IndustryList';

const VendorView = ({
    title,
    photos,
    description,
    formattedAddress,
    formattedPud,
    pudOptions,
    selectedPud,
    onPressPudFilter,
    bannerMessages = [],
    industryList,
    industryFilter,
    onPressIndustryFilter,
    openVendorOverview,
}) => {
    return (
        <>
            {bannerMessages.length > 0 && (
                <Banner
                    visible={true}
                    actions={[]}
                    icon="alert-circle"
                    style={{marginBottom: 8}}>
                    {bannerMessages.join(", ")}
                </Banner>
            )}

            <PhotoGallery photos={photos} />

            <JMSList.Item
                overline={formattedPud}
                title={title}
                description={formattedAddress}
                titleVariant={'headlineSmall'}
                right={() => <List.Icon icon="chevron-right" style={{height: 'auto'}} />}
                onPress={() => openVendorOverview()}
                style={{paddingBottom: 0, marginTop: 13}}
            />

            {description && <List.Item title="description" />}
            
            {industryList && (
                <IndustryList
                    title="Industries"
                    data={industryList}
                    onPress={onPressIndustryFilter}
                    value={industryFilter}
                />
            )}

            {pudOptions && (
                <SegmentedButtonGroup
                    title="Available Shopping Mode"
                    data={pudOptions}
                    value={selectedPud}
                    onPress={onPressPudFilter}
                />
            )}
        </>
    );
};

export default VendorView;
