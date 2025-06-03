import React from 'react';
import { StyleSheet, View } from 'react-native';

import MapboxGL from '@rnmapbox/maps';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MapboxGLWrapperPointAnnotationMaterialIcon = ({ 
  id,
  coordinate,
  iconName="map-marker",
  iconSize=32
}) =>   (
  <MapboxGL.PointAnnotation id={id} coordinate={coordinate}>
    <View style={styles.destinationIcon}>
      <MaterialCommunityIcons 
        name={iconName} 
        size={iconSize} 
        color={MD3LightTheme.colors.primary} />
    </View>
  </MapboxGL.PointAnnotation>
)

const styles = StyleSheet.create({
  destinationIcon: {
    flex: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapboxGLWrapperPointAnnotationMaterialIcon