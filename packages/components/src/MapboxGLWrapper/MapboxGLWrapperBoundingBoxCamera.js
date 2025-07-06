import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Dimensions, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

const getBoundingBox = (coordinates) => {
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    coordinates.forEach(([lng, lat]) => {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
    });

    if (coordinates.length !== 0) {
        const MIN_DELTA = 0.001;

        if (maxLng - minLng < MIN_DELTA) {
            const centerLng = (maxLng + minLng) / 2;
            minLng = centerLng - MIN_DELTA / 2;
            maxLng = centerLng + MIN_DELTA / 2;
        }

        if (maxLat - minLat < MIN_DELTA) {
            const centerLat = (maxLat + minLat) / 2;
            minLat = centerLat - MIN_DELTA / 2;
            maxLat = centerLat + MIN_DELTA / 2;
        }
    }

    return {
        sw: [minLng, minLat],
        ne: [maxLng, maxLat],
    };
};

const calculateZoomLevel = (boundingBox) => {
    const width = boundingBox.ne[0] - boundingBox.sw[0];
    const height = boundingBox.ne[1] - boundingBox.sw[1];
    const area = width * height;

    if (area < 0.01) return 14;
    if (area < 0.1) return 12;
    return 10;
};

const { height } = Dimensions.get('window');

const MapboxGLWrapperBoundingBoxCamera = forwardRef(({ coordinates = [], zoomLevel = 12, ...props }, ref) => {
    const mapCameraRef = useRef(null);
    const insets = useSafeAreaInsets();

    const top = insets.top === 0 ? MD3LightTheme.spacing.x8 : insets.top;
    const right = insets.right === 0 ? MD3LightTheme.spacing.x8 : insets.right;
    const left = insets.left === 0 ? MD3LightTheme.spacing.x8 : insets.left;

    const boundingBox = getBoundingBox(coordinates);
    const calculatedZoomLevel = calculateZoomLevel(boundingBox);

    useImperativeHandle(ref, () => ({
        setCameraSnapPoint,
    }));

    const setCameraSnapPoint = (snapPoint) => {
        mapCameraRef.current?.setCamera({
            bounds: boundingBox,
            zoomLevel: zoomLevel,
            padding: {
                paddingTop: top + MD3LightTheme.spacing.x8,
                paddingRight: right + MD3LightTheme.spacing.x15 + moderateScale(23),
                paddingLeft: left + MD3LightTheme.spacing.x15 + moderateScale(23),
                paddingBottom: snapPoint + MD3LightTheme.spacing.x8,
            },
            animationMode: 'flyTo',
            animationDuration: 250,
        });
    };

    return coordinates.length > 0 && boundingBox.sw[0] !== Infinity && boundingBox.ne[0] !== -Infinity ? (
        <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={calculatedZoomLevel || zoomLevel}
            bounds={boundingBox}
            padding={{
                paddingTop: top + MD3LightTheme.spacing.x8,
                paddingRight: right + MD3LightTheme.spacing.x15,
                paddingLeft: left + MD3LightTheme.spacing.x15,
                paddingBottom: MD3LightTheme.spacing.x15,
            }}
            animationMode="flyTo"
            animationDuration={250}
            {...props}
        />
    ) : null;
});

export default MapboxGLWrapperBoundingBoxCamera;
