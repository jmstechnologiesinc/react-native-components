import React, { useRef } from 'react';
import MapboxGL from '@rnmapbox/maps';

const MapboxGLWrapperVehicleIconMarker = ({ id = 'vehicle', title, longitude, latitude, rotation = 0 }) => {
    const shapeSourceRef = useRef(null);
    const symbolLayerRef = useRef(null);

    const featureCollection = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    id,
                    title,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
            },
        ],
    };

    return (
        <MapboxGL.ShapeSource id={`source-${id}`} ref={shapeSourceRef} shape={featureCollection}>
            <MapboxGL.Images
                images={{
                    vehicleIcon: require('./assets/car.png'),
                }}
            />

            <MapboxGL.SymbolLayer
                id={`layer-${id}`}
                ref={symbolLayerRef}
                style={{
                    iconImage: 'vehicleIcon',
                    iconSize: ['interpolate', ['linear'], ['zoom'], 12, 0.5],
                    iconRotate: rotation,
                    iconAllowOverlap: true,
                }}
            />
        </MapboxGL.ShapeSource>
    );
};

export default MapboxGLWrapperVehicleIconMarker;
