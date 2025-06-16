import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import MapboxGL from '@rnmapbox/maps';
import { Appbar, IconButton, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressSelectionSheet from './AddressSelectionSheet';
import { Config } from '../../Config'

const MapPicker = ({
    mapRef,
    cameraRef,
    isLocationPermissionDenied,
    isLoading,
    setIsLoading,
    onSaveLocation,
    onRegionChangeComplete,
    currentLocation,
    currentMapAdress,
    findUserLocation,
    centerMapOnUserLocation,
    onBackPress
}) => {
    const { height } = Dimensions.get('window');
    const insets = useSafeAreaInsets();

    MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);

    return (
        <>
            <MapboxGL.MapView
                zoomEnabled={true}
                compassEnabled={false}
                attributionEnabled={false}
                scaleBarEnabled={false}
                logoEnabled={false}
                ref={mapRef}
                style={styles.map}
                onRegionDidChange={onRegionChangeComplete}
                styleURL={MapboxGL.StyleURL.Street}
                onDidFinishLoadingMap={() => setIsLoading(false)}
                onRegionIsChanging={() => setIsLoading(true)}
            >
                {currentLocation ? (
                    <MapboxGL.Camera
                        zoomLevel={15}
                        centerCoordinate={[currentLocation.longitude, currentLocation.latitude]}
                        animationDuration={1000}
                        ref={cameraRef}
                    />
                ) : null}
                <MapboxGL.UserLocation visible={true} />
            </MapboxGL.MapView>

            {currentLocation ? (
                <View style={styles.iconLocation}>
                    <IconButton
                        icon="map-marker-outline"
                        size={MD3LightTheme.spacing.x12}
                        iconColor={MD3LightTheme.colors.primary}
                    />
                </View>
            ) : null}

            {!isLocationPermissionDenied && (
                <View style={[styles.centerButton, { bottom: height * 0.25 }]}>
                    <IconButton
                        icon="crosshairs-gps"
                        size={MD3LightTheme.spacing.x6}
                        mode="contained"
                        onPress={centerMapOnUserLocation}
                    />
                </View>
            )}

            <AddressSelectionSheet
                currentMapAdress={currentMapAdress ? findUserLocation(currentMapAdress) : currentLocation}
                onSaveLocation={onSaveLocation}
                isLoading={isLoading}
            />

            <View style={{ position: 'absolute', top: moderateScale(insets.top) }}>
                <Appbar.BackAction mode="contained" onPress={onBackPress} />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    centerButton: {
        position: 'absolute',
        right: MD3LightTheme.spacing.x2,
    },
    iconLocation: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -41 }, { translateY: -56 }],
        zIndex: 1,
    },
});

export default MapPicker