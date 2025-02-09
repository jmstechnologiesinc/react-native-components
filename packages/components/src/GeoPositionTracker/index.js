import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapboxGL, { Logger } from '@rnmapbox/maps';
import { MD3LightTheme, IconButton } from '@jmstechnologiesinc/react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Config } from '../Config'
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VehiclesList from './VehiclesList';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'

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
const APIKEY = Config.MAPBOX_ACCESS_TOKEN;

MapboxGL.setAccessToken(APIKEY);
MapboxGL.setTelemetryEnabled(false);

const GeoPositionTracker = ({
  customerPosition,
  currentDriverPosition,
  vendorPosition,
  currentSnapPoint,
  nearbyVehicleLocations,
  getGPSLocationOnPress,
  isLocationPermission
}) => {
  const mapRef = useRef(null);
  const [routeDirections, setRouteDirections] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState([
    customerPosition?.longitude,
    customerPosition?.latitude,
  ]);


  const insets = useSafeAreaInsets();

  const top = insets.top === 0 ? MD3LightTheme.spacing.x8 : insets.top;
  const right = insets.right === 0 ? MD3LightTheme.spacing.x8 : insets.right;
  const left = insets.left === 0 ? MD3LightTheme.spacing.x8 : insets.left

  const [driverHeading, setDriverHeading] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(12);
  const [boundingBox, setBoundingBox] = useState(null);

  const { height } = Dimensions.get('window');


  const filterVehiclePositions = nearbyVehicleLocations?.filter(item =>
    !(item.latitud === currentDriverPosition?.latitude && item.longitud === currentDriverPosition?.longitude)
  );

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


  const createRouteLine = async (startPosition, endPosition) => {
    const startCoords = `${startPosition.longitude},${startPosition.latitude}`;
    const endCoords = `${endPosition.longitude},${endPosition.latitude}`;
    const geometries = 'geojson';
    const typeVehicle = 'driving';

    const url = `https://api.mapbox.com/directions/v5/mapbox/${typeVehicle}/${startCoords};${endCoords}?alternatives=false&geometries=${geometries}&steps=true&overview=full&access_token=${Config.MAPBOX_ACCESS_TOKEN}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes && json.routes.length) {
        const route = json.routes[0];
        const coordinates = route.geometry.coordinates;
        const steps = route.legs[0]?.steps;
        if (steps && steps.length) {
          const heading = steps[0].maneuver.bearing_after;
          setDriverHeading(heading);
        }

        setRouteDirections(makeRouterFeature(coordinates));
        setDestinationCoords(coordinates[coordinates.length - 1]);

        const boundingBox = getBoundingBox(coordinates);

        const calculatedZoomLevel = calculateZoomLevel(boundingBox);

        setBoundingBox(boundingBox);
        setZoomLevel(calculatedZoomLevel);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    createRouteLine(vendorPosition, customerPosition);
  }, []);

  useEffect(() => {
    if (currentDriverPosition) {
      createRouteLine(currentDriverPosition, customerPosition);
    }
  }, [currentDriverPosition]);


  useEffect(() => {
    if (currentSnapPoint === 0.8) {
      mapRef.current?.setCamera({
        bounds: boundingBox,
        zoomLevel: zoomLevel,
        padding: {
          paddingTop: top,
          paddingRight: right,
          paddingLeft: left,
          paddingBottom: height * currentSnapPoint,
        },
        animationMode: 'flyTo',
        animationDuration: 250,
      })
    } else {
      mapRef.current?.setCamera({
        bounds: boundingBox,
        zoomLevel: zoomLevel,
        padding: {
          paddingTop: top,
          paddingRight: right,
          paddingLeft: left,
          paddingBottom: height * currentSnapPoint,
        },
        animationMode: 'flyTo',
        animationDuration: 250,
      })
    }
  }, [currentSnapPoint]);

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


  const centerCoordinate = currentDriverPosition
    ? [currentDriverPosition?.longitude, currentDriverPosition?.latitude]
    : vendorPosition
      ? [vendorPosition?.longitude, vendorPosition?.latitude]
      : false;

  const resetToInitialPosition = async () => {


    if (!isLocationPermission) {
      await getGPSLocationOnPress();
    }

    if (mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: [customerPosition?.longitude, customerPosition?.latitude],
        zoomLevel: zoomLevel,
        bounds: boundingBox,
        padding: {
          paddingTop: top,
          paddingRight: right,
          paddingLeft: left,
          paddingBottom: height * currentSnapPoint,
        },
        animationMode: 'flyTo',
        animationDuration: 500,
      });
    }
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
      mapRef={mapRef}
    >

      <MapboxGL.Camera
        zoomLevel={zoomLevel}
        bounds={boundingBox}
        ref={mapRef}
        padding={{
          paddingTop: top,
          paddingRight: right,
          paddingLeft: left,
          paddingBottom: height * currentSnapPoint,
        }}
        animationMode="flyTo"
        animationDuration={200}
      />

      {centerCoordinate && customerPosition && vendorPosition ?
        <MapboxGL.ShapeSource id="routeSource" shape={routeDirections}>
          <MapboxGL.LineLayer id="routeLine" style={{ lineColor: MD3LightTheme.colors.primary, lineWidth: 4 }} />
        </MapboxGL.ShapeSource>
        :
        <MapboxGL.UserLocation animated={true} androidRenderMode="gps" showsUserHeadingIndicator={true} />
      }

      {centerCoordinate && customerPosition ? (
        <>
          <MapboxGL.Images images={{ driverIcon: require('./tracking/car.png') }} />
          <MapboxGL.ShapeSource id="driverSource" shape={routeDirections}>
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
        </>
      ) : null}


      {
        centerCoordinate && customerPosition && vendorPosition ?
          <MapboxGL.PointAnnotation id="destination" coordinate={destinationCoords}>

            <View style={styles.destinationIcon}>
              <MaterialCommunityIcons name="map-marker-radius" size={24} color={MD3LightTheme.colors.primary} />
            </View>
          </MapboxGL.PointAnnotation>
          :
          null
      }

      {nearbyVehicleLocations &&
        <VehiclesList
          vehicleListPositions={nearbyVehicleLocations}
          filterVehiclePositions={filterVehiclePositions}
          driverHeading={driverHeading}
        />
      }

      <View style={{
        position: 'absolute',
        bottom: height * 0.48,
        right: 0,

      }}>
        <IconButton
          icon="crosshairs-gps"
          size={moderateScale(24)}
          mode='contained'
          onPress={resetToInitialPosition}
        />
      </View>
    </MapboxGL.MapView>
  );
};

const styles = StyleSheet.create({
  destinationIcon: {
    flex: 1,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GeoPositionTracker;


