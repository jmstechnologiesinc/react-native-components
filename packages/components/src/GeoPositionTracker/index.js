import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapboxGL, { Logger } from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const APIKEY = 'pk.eyJ1Ijoiam1zdGVjaG5vbG9naWVzaW5jIiwiYSI6ImNsZWtrd2JqdDBpdXkzcnA1YzZ6amNwOGIifQ.1GwSU5_aWllbCNmP9M23aw'
MapboxGL.setAccessToken(APIKEY);

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
MapboxGL.setAccessToken(APIKEY);

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
  const [loading, setLoading] = useState(true);

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
    setLoading(true);

    const startCoords = `${startPosition.longitude},${startPosition.latitude}`;
    const endCoords = `${endPosition.longitude},${endPosition.latitude}`;
    const geometries = 'geojson';
    const typeVehicle = 'driving';

    const url = `https://api.mapbox.com/directions/v5/mapbox/${typeVehicle}/${startCoords};${endCoords}?alternatives=false&geometries=${geometries}&steps=true&overview=full&access_token=${APIKEY}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes && json.routes.length) {
        const coordinates = json.routes[0].geometry.coordinates;
        setRouteDirections(makeRouterFeature(coordinates));
        setDestinationCoords(coordinates[coordinates.length - 1]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching directions:', error);
      setLoading(false);
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
        // styleURL="mapbox://styles/mapbox/navigation-night-v1"
        rotateEnabled={true}
      >
        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={centerCoordinate}
          animationMode="flyTo"
          animationDuration={2000}
        />

        {routeDirections && (
          <MapboxGL.ShapeSource id="routeSource" shape={routeDirections}>
            <MapboxGL.LineLayer
              id="routeLine"
              style={{ lineColor: MD3LightTheme.colors.primary, lineWidth: 4 }}
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

        <MapboxGL.UserLocation
          animated
          androidRenderMode="gps"
          showsUserHeadingIndicator
        />

      </MapboxGL.MapView>

      {loading && <ActivityIndicator size="large" color="white" style={styles.loadingIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 800
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0 ,0 , 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
  },
  cardContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  destinationIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeProfileList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  flatList: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 40,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  routeProfileButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 8,
    borderColor: '#fff',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  selectedRouteProfileButton: {
    backgroundColor: '#FA9E14',
    borderColor: '#FA9E14',
  },
  routeProfileButtonText: {
    color: '#fff',
    marginTop: 5,
  },
  selectedRouteProfileButtonText: {
    color: 'white',
  },
});

export default GeoPositionTracker;