import React from 'react';

import MapboxGL from '@rnmapbox/maps';

import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MapboxGLWrapperPointAnnotationMaterialIcon from '@jmstechnologiesinc/react-native-components/lib/MapboxGLWrapper/MapboxGLWrapperPointAnnotationMaterialIcon';

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
          }}/>
      </MapboxGL.ShapeSource>
      {destinationCoords?.length > 0 ? (
        <MapboxGLWrapperPointAnnotationMaterialIcon 
          id="tbt-drop-off-location-point-anotation" 
          coordinate={destinationCoords} />
      ) : null}
    </>
  ) : null
}

export default MapboxGLWrapperDrawTurnByTurnRoute