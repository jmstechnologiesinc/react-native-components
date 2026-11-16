// The web twin of MapPicker (index.js): the same props and layout on the package's web map wrapper instead of
// @rnmapbox/maps. @rnmapbox's own web build imports mapbox-gl and its stylesheet; reached from the barrel through this
// component, it put the whole map engine in every page of the web hosts, a map or not. The wrapper loads it with
// import() the first time a map renders. index.js, the native picker, is unchanged.
import { View, Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { Appbar, IconButton, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapboxGLWrapper from '../../MapboxGLWrapper';
import AddressSelectionSheet from './AddressSelectionSheet';

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
    onBackPress,
}) => {
    const { height } = Dimensions.get('window');
    const insets = useSafeAreaInsets();

    return (
        <>
            <MapboxGLWrapper
                ref={mapRef}
                style={styles.map}
                onRegionDidChange={onRegionChangeComplete}
                onDidFinishLoadingMap={() => setIsLoading(false)}
                onRegionIsChanging={() => setIsLoading(true)}
            >
                {currentLocation ? (
                    <MapboxGLWrapper.Camera
                        zoomLevel={15}
                        centerCoordinate={[currentLocation.longitude, currentLocation.latitude]}
                        animationDuration={1000}
                        ref={cameraRef}
                    />
                ) : null}
                <MapboxGLWrapper.FolowUserLocation />
            </MapboxGLWrapper>

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

            <View style={[styles.backAction, { top: moderateScale(insets.top) }]}>
                <Appbar.BackAction mode="contained" onPress={onBackPress} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    centerButton: {
        position: 'absolute',
        right: MD3LightTheme.spacing.x2,
    },
    backAction: {
        position: 'absolute',
    },
    iconLocation: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -41 }, { translateY: -56 }],
        zIndex: 1,
    },
});

export default MapPicker;
