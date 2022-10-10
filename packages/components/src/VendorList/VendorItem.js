import React from 'react';
import { StyleSheet } from 'react-native';

import { Card, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

import * as JMSList from "../List/List";

const VendorItem = ({ item, onPress }) => <Card
    style={styles.card}
    onPress={() => onPress(item)}>
    <Card.Cover source={{ uri: item.photos?.[0] }} />
    <JMSList.Item
        overline={item.industries.map(item => VENDOR_INDUSTRIES_MAPPING[item].title).join(" . ")}
        title={item.title}
        description={[item.formattedPub, item.formattedHitDistance].join(" · ")}/>
</Card>

const styles = StyleSheet.create({
    card: {
        marginVertical: MD3LightTheme.margin / 2,
        marginHorizontal: MD3LightTheme.margin
    },
});

export default VendorItem;
