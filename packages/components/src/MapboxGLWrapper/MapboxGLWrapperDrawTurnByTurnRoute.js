import React from 'react';
import { StyleSheet, View } from 'react-native';

import MapboxGL from '@rnmapbox/maps';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MapboxGLWrapperDrawTurnByTurnRoute = ({ 
  route,
  destinationCoords,
  driverHeading
}) => {
  return route ? (
    <>
      <MapboxGL.ShapeSource id="routeSource" shape={route}>
        <MapboxGL.LineLayer id="routeLine" style={{ lineColor: MD3LightTheme.colors.primary, lineWidth: 4, lineOffset: -2, }} />
      </MapboxGL.ShapeSource>
      <MapboxGL.Images images={{ driverIcon: require('./assets/car.png') }} />
      <MapboxGL.ShapeSource id="driverSource" shape={route}>
        <MapboxGL.SymbolLayer
          id="driverIconLayer"
          style={{
            iconImage: 'driverIcon',
            iconAnchor: 'center',
            iconAllowOverlap: true,
            iconRotate: driverHeading,
            iconSize: 0.5,
          }}
        />
      </MapboxGL.ShapeSource>
      {destinationCoords?.length > 0 ? (
        <MapboxGL.PointAnnotation id="destination" coordinate={destinationCoords}>
          <View style={styles.destinationIcon}>
            <MaterialCommunityIcons name="map-marker" size={32} color={MD3LightTheme.colors.primary} />
          </View>
        </MapboxGL.PointAnnotation>
      ) : null}
    </>
  ) : null
}

const styles = StyleSheet.create({
  destinationIcon: {
    flex: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapboxGLWrapperDrawTurnByTurnRoute