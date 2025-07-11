import { View, StyleSheet } from 'react-native';
import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { MD3LightTheme, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

const MapboxGLWrapperLocationTooltip = ({ latitude, longitude, title, onPress }) => {
    return latitude && longitude ? (
        <MapboxGL.MarkerView id="marker" coordinate={[longitude, latitude]} anchor={{ x: 0.5, y: 1.6 }}>
            <TouchableRipple onPress={onPress}>
                <View style={styles.markerContainer}>
                    <Text variant="titleMedium">{title?.length > 20 ? `${title.substring(0, 20)}...` : title}</Text>
                    {onPress ? <MaterialCommunityIcons name="chevron-right" size={24} color="black" /> : null}
                </View>
            </TouchableRipple>
        </MapboxGL.MarkerView>
    ) : null;
};

const styles = StyleSheet.create({
    markerContainer: {
        backgroundColor: MD3LightTheme.colors.background,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MapboxGLWrapperLocationTooltip;
