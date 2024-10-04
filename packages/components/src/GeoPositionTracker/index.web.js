import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Config } from '../Config'


const GeoPositionTracker = ({ customerPosition, currentDriverPosition, vendorPosition }) => {
  const [routeDirections, setRouteDirections] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState([customerPosition.longitude, customerPosition.latitude]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    createRouteLine(vendorPosition, customerPosition);
  }, []);

  useEffect(() => {
    if (currentDriverPosition) {
      createRouteLine(currentDriverPosition, customerPosition);
    }
  }, [currentDriverPosition]);

  const makeRouterFeature = (coordinates) => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },
    ],
  });

  const createRouteLine = async (startPosition, endPosition) => {
    setLoading(true);

    const startCoords = `${startPosition.longitude},${startPosition.latitude}`;
    const endCoords = `${endPosition.longitude},${endPosition.latitude}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?alternatives=false&geometries=geojson&steps=true&overview=full&access_token=${Config.MAPBOX_ACCESS_TOKEN}`;

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

  console.log(centerCoordinate)
  return (
    <View style={styles.container}>
      <Map
        initialViewState={{
          longitude: centerCoordinate[0],
          latitude: centerCoordinate[1],
          zoom: 16,
        }}
        style={{ height: 300 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/mapbox/navigation-night-v1"
        mapboxAccessToken={Config.MAPBOX_ACCESS_TOKEN}
        attributionControl={true}

      >


        {centerCoordinate && (
          <Marker longitude={centerCoordinate[0]} latitude={centerCoordinate[1]}>
            <MaterialCommunityIcons name="checkbox-blank-circle" size={16} color={MD3LightTheme.colors.primary} />
          </Marker>
        )}
        {routeDirections && (
          <Source id="routeSource" type="geojson" data={routeDirections}>
            <Layer
              id="routeLine"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{ 'line-color': MD3LightTheme.colors.primary, 'line-width': 4 }}
            />
          </Source>
        )}

        {destinationCoords && (
          <Marker longitude={destinationCoords[0]} latitude={destinationCoords[1]}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color={MD3LightTheme.colors.primary} />
          </Marker>
        )}


      </Map>
      {loading && <ActivityIndicator size="large" color={MD3LightTheme.colors.primary} style={{ position: 'absolute', top: '50%', left: '50%' }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300
  },
  map: {
    flex: 1,
  },

});

export default GeoPositionTracker;
