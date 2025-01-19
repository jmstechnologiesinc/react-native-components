import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapboxGL, { Logger } from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Config } from '../Config'
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { carList } from './tracking/carList'

Logger.setLogCallback((log) => {
  const { message } = log;

  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

const DriverPosition = ({
  customerPosition,
  currentDriverPosition,
  vendorPosition,
  currentSnapPoint = 0,
}) => {
  const mapRef = useRef(null);

  const [routeDirections, setRouteDirections] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState([
    customerPosition.longitude,
    customerPosition.latitude,
  ]);

  const insets = useSafeAreaInsets();

  const top = insets.top === 0 ? MD3LightTheme.spacing.x8 : insets.top;
  const right = insets.right === 0 ? MD3LightTheme.spacing.x8 : insets.right;
  const left = insets.left === 0 ? MD3LightTheme.spacing.x8 : insets.left

  const [driverHeading, setDriverHeading] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(12);
  const [boundingBox, setBoundingBox] = useState(null);

  const { height } = Dimensions.get('window');
  const APIKEY = Config.MAPBOX_ACCESS_TOKEN;

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






  return (
    <MapboxGL.MapView
      style={{
        flex: 1,
      }}
      zoomEnabled={true}
      styleURL={Mapbox.StyleURL.Street}
      compassEnabled={false}
      logoEnabled={false}
      attributionEnabled={false}
      scaleBarEnabled={false}
    >


    </MapboxGL.MapView>
  );
};

const styles = StyleSheet.create({
  destinationIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DriverPosition;

