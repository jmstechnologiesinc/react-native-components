import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL, { Logger } from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Config } from '../Config'

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


const GeoPositionTracker = ({
  customerPosition,
  currentDriverPosition,
  vendorPosition
}) => {
  const [routeDirections, setRouteDirections] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState([
    customerPosition.longitude,
    customerPosition.latitude,
  ]);

  const [driverHeading, setDriverHeading] = useState(0)

  const APIKEY = Config.MAPBOX_ACCESS_TOKEN

  useEffect(() => {

    createRouteLine(vendorPosition, customerPosition);
  }, []);

  useEffect(() => {

    if (currentDriverPosition) {
      createRouteLine(currentDriverPosition, customerPosition);
    }
  }, [currentDriverPosition]);

  const makeRouterFeature = (coordinates) => {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      ],
    };
  };



  const createRouteLine = async (startPosition, endPosition) => {

    const startCoords = `${startPosition.longitude},${startPosition.latitude}`;
    const endCoords = `${endPosition.longitude},${endPosition.latitude}`;
    const geometries = 'geojson';
    const typeVehicle = 'driving';

    const url = `https://api.mapbox.com/directions/v5/mapbox/${typeVehicle}/${startCoords};${endCoords}?alternatives=false&geometries=${geometries}&steps=true&overview=full&access_token=${APIKEY}`;


    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes && json.routes.length) {
        const route = json.routes[0];
        const coordinates = route.geometry.coordinates;

        // Log the entire response to understand its structure
        console.log('Directions API response:', json);

        // Extract the heading from the first step if available
        const steps = route.legs[0]?.steps;
        if (steps && steps.length) {
          const heading = steps[0].maneuver.bearing_after;
          setDriverHeading(heading);
          console.log('Initial heading:', heading);
        }

        setRouteDirections(makeRouterFeature(coordinates));
        setDestinationCoords(coordinates[coordinates.length - 1]);
      }

    } catch (error) {
      console.error('Error fetching directions:', error);
    }

  };

  const centerCoordinate = currentDriverPosition
    ? [currentDriverPosition.longitude, currentDriverPosition.latitude]
    : [vendorPosition.longitude, vendorPosition.latitude];

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        zoomEnabled={true}
        rotateEnabled={true}
      >
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={centerCoordinate}
          animationMode='moveTo'
          animationDuration={2000}
        />

        {routeDirections && (
          <MapboxGL.ShapeSource id="routeSource" shape={routeDirections}>
            <MapboxGL.LineLayer
              id="routeLine"
              style={{ lineColor: MD3LightTheme.colors.primary, lineWidth: 4 }}
            >
            </MapboxGL.LineLayer>
          </MapboxGL.ShapeSource>
        )}

        {centerCoordinate && (
          <MapboxGL.ShapeSource id="driverSource" shape={routeDirections}>
            <MapboxGL.SymbolLayer
              id="driverIcon"
              style={{
                iconImage: require('./tracking/car.png'),
                iconSize: 0.5,
                iconAnchor: 'center',
                iconAllowOverlap: true,
                iconRotate: driverHeading
              }}
            />
          </MapboxGL.ShapeSource>
        )}



        {destinationCoords && (
          <MapboxGL.PointAnnotation id="destination" coordinate={destinationCoords}>
            <View style={styles.destinationIcon}>
              <MaterialCommunityIcons name="map-marker-radius" size={24} color={MD3LightTheme.colors.primary} />
            </View>
          </MapboxGL.PointAnnotation>
        )}

      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500
  },
  map: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
  },

  destinationIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GeoPositionTracker;