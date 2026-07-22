import React from 'react';
import { Image, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

const CAR_SIZE = 40;

// Rendered as a MarkerView -- a native view the map repositions every frame,
// the SAME mechanism the ETA label uses -- so the car and the label move in
// lockstep at exactly the same speed. (It was previously a ShapeSource +
// SymbolLayer, a GL layer updated over the bridge with latency, which visibly
// trailed the label.) The car image rotates in place to the heading; the map is
// north-up, so a clockwise CSS rotation of `heading` deg points it correctly.
const MapboxGLWrapperVehicleIconMarker = ({ id = 'vehicle', longitude, latitude, rotation = 0 }) => {
    return Number.isFinite(longitude) && Number.isFinite(latitude) ? (
        <MapboxGL.MarkerView
            id={`marker-${id}`}
            coordinate={[longitude, latitude]}
            anchor={{ x: 0.5, y: 0.5 }}
            allowOverlap
        >
            <Image
                source={require('./assets/car.png')}
                style={[styles.car, { transform: [{ rotate: `${rotation}deg` }] }]}
                resizeMode="contain"
            />
        </MapboxGL.MarkerView>
    ) : null;
};

const styles = StyleSheet.create({
    car: {
        width: CAR_SIZE,
        height: CAR_SIZE,
    },
});

export default MapboxGLWrapperVehicleIconMarker;
