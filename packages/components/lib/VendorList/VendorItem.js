import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, TouchableRipple } from '@jmsstudiosinc/react-native-paper';
import { useNavigation } from '@react-navigation/native';

const renderVendorItem = ({ item }) => {
    const navigation = useNavigation();

    return (
        <View style={[styles.container]} contentContainerStyle={styles.content}>
            <TouchableRipple
                onPress={() =>
                    navigation.navigate('SingleVendor', {
                        vendor: item,
                    })
                }
            >
                <Card style={styles.card} mode="elevated">
                    <Card.Cover source={{ uri: item.photos }} />
                    <Card.Title
                        title={item.title}
                        subtitle={`${item.formattedPub} - ${item.formattedHitDistance}`}
                        titleVariant="headlineSmall"
                        subtitleVariant="bodyLarge"
                    />
                </Card>
            </TouchableRipple>
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

export default renderVendorItem;
