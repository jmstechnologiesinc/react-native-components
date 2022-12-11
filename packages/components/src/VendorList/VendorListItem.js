import React from 'react';

import { Card, Text } from '@jmsstudiosinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';
import { interpunct, getMainPhoto } from '@jmsstudiosinc/commons';

const VendorListItem = ({ item, onPress }) => (
    <Card mode="contained" onPress={() => onPress(item)}>
        <Card.Cover source={{ uri: getMainPhoto(item.photos) }} />
        <Card.Title
            title={item.title}
            subtitle={interpunct([item.formattedPub, item.formattedHitDistance])}
            titleVariant="headlineMedium"
            subtitleVariant="bodyLarge"
        />
        <Card.Content>
            <Text variant="bodyMedium">
                {interpunct(item.industries.map((industry) => VENDOR_INDUSTRIES_MAPPING[industry].title))}
            </Text>
        </Card.Content>
    </Card>
);

export default VendorListItem;
