import React from 'react';

import { Card } from '@jmsstudiosinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';
import { interpunct, getMainPhoto } from '@jmsstudiosinc/commons';

import * as JMSList from '../List/List';

const VendorListItem = ({ item, onPress }) => (
    <Card onPress={() => onPress(item)}>
        <Card.Cover source={{ uri: getMainPhoto(item.photos) }} />
        <JMSList.Item
            title={item.title}
            overline={interpunct(item.industries.map((industry) => VENDOR_INDUSTRIES_MAPPING[industry].title))}
            description={interpunct([item.formattedPub, item.formattedHitDistance])} />
    </Card>
);

export default VendorListItem;
