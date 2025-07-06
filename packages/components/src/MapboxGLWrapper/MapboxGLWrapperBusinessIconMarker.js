import React, { useRef } from 'react';
import MapboxGL from '@rnmapbox/maps';

const MapboxGLWrapperBusinessIconMarker = ({ id, title, longitude, latitude, rotation = 0 }) => {
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
                    businessIcon: require('./assets/restaurant.png'),
                }}
            />

            <MapboxGL.SymbolLayer
                id={`layer-${id}`}
                ref={symbolLayerRef}
                style={{
                    iconImage: 'businessIcon',
                    iconSize: [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0.3,
                        16,
                        0.4,
                        17,
                        0.5,
                        18,
                        0.6,
                        19,
                        0.7,
                        20,
                        0.8,
                    ],
                    iconRotate: rotation,
                    iconAllowOverlap: true,
                    textField: ['get', 'title'],
                    textSize: ['interpolate', ['linear'], ['zoom'], 15, 0, 16, 9, 17, 14, 18, 16, 19, 18, 20, 20],
                    textOffset: [0, 1.2],
                    textAllowOverlap: true,
                    textAnchor: 'top',
                }}
            />
        </MapboxGL.ShapeSource>
    );
};

export default MapboxGLWrapperBusinessIconMarker;
