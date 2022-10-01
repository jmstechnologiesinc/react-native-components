import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@jmsstudiosinc/react-native-paper';

const RenderVendorItem = ({ item, onPress }) => {
    return (
        <View style={[styles.container]} contentContainerStyle={styles.content}>
            <Card
                style={styles.card}
                mode="elevated"
                onPress={() => onPress(item)}
            >
                <Card.Cover source={{ uri: item.photos }} />
                <Card.Title
                    title={item.title}
                    subtitle={`${item.formattedPub} - ${item.formattedHitDistance}`}
                    titleVariant="headlineSmall"
                    subtitleVariant="bodyLarge"
                />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 4,
    },
    card: {
        marginVertical: 4,
        marginHorizontal: 8,
    },
});

export default RenderVendorItem;
