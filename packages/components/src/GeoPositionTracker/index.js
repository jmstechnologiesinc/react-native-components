import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { mapStyle } from '@jmstechnologiesinc/react-native-components/lib/GeoPositionTracker/mapStyle'
const GOOGLE_PLACES_API_KEY = 'AIzaSyDj4t6Z_P4Iw8Az0-CrpfJZamqCHrwM950'

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GeoPositionTracker = ({
  customerPosition,
  currentDriverPosition,
  vendorPosition
}) => {

  const mapRef = useRef()
  const cameraLocation = useRef(vendorPosition)


  useEffect(() => {
    if (currentDriverPosition) {
      mapRef.current.animateToRegion({
        ...currentDriverPosition,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);

      // mapRef.current.animateCamera({ center: currentDriverPosition });
    }
  }, [currentDriverPosition]);



  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        customMapStyle={mapStyle}
        moveOnMarkerPress={false}

      >
        <MapViewDirections
          origin={currentDriverPosition !== null ? currentDriverPosition : vendorPosition}
          destination={customerPosition}
          apikey={GOOGLE_PLACES_API_KEY}
          strokeColor={MD3LightTheme.colors.primary}
          strokeWidth={4}
          optimizeWaypoints={true}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },



});

export default GeoPositionTracker;