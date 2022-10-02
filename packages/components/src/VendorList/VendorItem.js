import React from 'react';
import { StyleSheet } from 'react-native';

import { Card } from '@jmsstudiosinc/react-native-paper';

const VendorItem = ({ item, onPress }) => <Card
    style={styles.card}
    onPress={() => onPress(item)}>
    <Card.Cover source={{ uri: item.photos?.[0] }} />
    <Card.Title
        title={item.title}
        subtitle={[item.formattedPub, item.formattedHitDistance].join(" · ")} />
</Card>

const styles = StyleSheet.create({
    card: {
        marginVertical: 4,
    },
});

export default VendorItem;
