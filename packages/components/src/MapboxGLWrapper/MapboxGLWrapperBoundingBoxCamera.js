import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {  Dimensions, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const getBoundingBox = (coordinates) => {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  coordinates.forEach(coord => {
    const [lng, lat] = coord;
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  });

  return {
    sw: [minLng, minLat],
    ne: [maxLng, maxLat],
  }
};

const calculateZoomLevel = (boundingBox) => {
  const width = boundingBox.ne[0] - boundingBox.sw[0];
  const height = boundingBox.ne[1] - boundingBox.sw[1];
  const area = width * height;

  if (area < 0.01) return 14
  if (area < 0.1) return 12
  return 10;
};

const { height } = Dimensions.get('window');

const MapboxGLWrapperBoundingBoxCamera = forwardRef(({
  coordinates=[],
  zoomLevel = 12,
  ...props
}, ref) => {
  const mapCameraRef = useRef(null);
  const insets = useSafeAreaInsets();

  const top = insets.top === 0 ? MD3LightTheme.spacing.x8 : insets.top;
  const right = insets.right === 0 ? MD3LightTheme.spacing.x8 : insets.right;
  const left = insets.left === 0 ? MD3LightTheme.spacing.x8 : insets.left

  const SNAP_POINT_SMALL = Platform.OS === 'ios' ? 0.73 : 0.77
  const SNAP_POINT_MEDIUM = Platform.OS === 'ios' ? 0.6 : 0.64

  const boundingBox = getBoundingBox(coordinates);
  const calculatedZoomLevel = calculateZoomLevel(boundingBox);

  useImperativeHandle(ref, () => ({
    setCameraSnapPoint
  }));

  const setCameraSnapPoint = (snapPoint) => {
    let paddingBottom;

    if (snapPoint === 1) {
      paddingBottom = height * SNAP_POINT_SMALL;
    } else if (snapPoint === 0.75) {
      paddingBottom = height * SNAP_POINT_MEDIUM;
    } else {
      paddingBottom = height * snapPoint;
    } 

    mapCameraRef.current?.setCamera({
      bounds: boundingBox,
      zoomLevel: zoomLevel,
      padding: {
        paddingTop: top + MD3LightTheme.spacing.x15,
        paddingRight: right + MD3LightTheme.spacing.x15,
        paddingLeft: left + MD3LightTheme.spacing.x15,
        paddingBottom,
      },
      animationMode: 'flyTo',
      animationDuration: 250,
    });
  }

  return (
    <MapboxGL.Camera
      ref={mapCameraRef}
      zoomLevel={calculatedZoomLevel || zoomLevel}
      bounds={boundingBox}
      padding={{
        paddingTop: top + MD3LightTheme.spacing.x15,
        paddingRight: right + MD3LightTheme.spacing.x15,
        paddingLeft: left + MD3LightTheme.spacing.x15,
        paddingBottom: MD3LightTheme.spacing.x15
      }}
      animationMode="flyTo"
      animationDuration={250}
      {...props} />
  );
});

export default MapboxGLWrapperBoundingBoxCamera;
