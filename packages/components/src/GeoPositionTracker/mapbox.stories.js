import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { Config } from '../Config';
import GeoPositionTracker from '.';


MapboxGL.setAccessToken('pk.eyJ1Ijoiam1zdGVjaG5vbG9naWVzaW5jIiwiYSI6ImNsZWtrd2JqdDBpdXkzcnA1YzZ6amNwOGIifQ.1GwSU5_aWllbCNmP9M23aw');

export default {
  title: 'Mapbox/BasicMap',
  component: MapboxGL.MapView,
};



export const BasicMap = () => (
  <MapboxGL.MapView style={{ flex: 1, height: 400 }}>
    <MapboxGL.Camera zoomLevel={12} centerCoordinate={[-73.935242, 40.73061]} />
  </MapboxGL.MapView>
);

const originLocation = { latitude: 42.707564063918513, longitude: -71.16235187906001 }
const dropoffLocation = { latitude: 42.71074176591852, longitude: -71.16283362348541 }

export const TrackerExample = () => (
  <GeoPositionTracker
    customerPosition={originLocation}
    currentDriverPosition={dropoffLocation}
    vendorPosition={dropoffLocation}
    currentSnapPoint={0.5}
  />
);