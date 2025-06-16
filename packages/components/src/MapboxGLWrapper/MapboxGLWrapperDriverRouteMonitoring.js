import React, { forwardRef, useEffect, useState } from 'react';

import Config from 'react-native-config';
import MapboxGLWrapper from './MapboxGLWrapper';

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

const MapboxGLWrapperDriverRouteMonitoring = forwardRef(({
  originLocation,
  dropoffLocation,
  onLocationPress,
}, ref) => {
  const [turnByTurnRoute, setTurnByTurnRoute] = useState([]);
  const [turnByTurnOriginLocation, setTurnByTurnOriginLocation] = useState();
  const [turnByTurnDropoffLocation, setTurnByTurnDropoffLocation] = useState([]);

  const [driverHeading, setDriverHeading] = useState(0)

  useEffect(() => {
    if (originLocation && dropoffLocation) {
      createRouteLine(originLocation, dropoffLocation);
    }
  }, [originLocation, dropoffLocation]);

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

        setTurnByTurnRoute(coordinates);
        setTurnByTurnOriginLocation(coordinates[0])
        setTurnByTurnDropoffLocation(coordinates[coordinates.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  return (
    <>
      <MapboxGLWrapper.BoundingBoxCamera ref={ref} coordinates={turnByTurnRoute} />
      {turnByTurnOriginLocation ? (
        <>
          <MapboxGLWrapper.DrawTurnByTurnRoute 
            driverHeading={driverHeading}
            route={makeRouterFeature(turnByTurnRoute)}
            destinationCoords={turnByTurnDropoffLocation} 
            turnByTurnOriginLocation={turnByTurnOriginLocation}
            
            />
          {originLocation?.formattedAddress ? (
            <MapboxGLWrapper.LocationTooltip 
              title={originLocation.formattedAddress}
              longitude={turnByTurnOriginLocation[0]}
              latitude={turnByTurnOriginLocation[1]}
              onPress={onLocationPress} />
          ) : null}
        </>
      ) : null}

      {turnByTurnDropoffLocation?.length > 0 && dropoffLocation?.formattedAddress ? (
        <MapboxGLWrapper.LocationTooltip 
          title={dropoffLocation?.formattedAddress}
          longitude={turnByTurnDropoffLocation[0]}
          latitude={turnByTurnDropoffLocation[1]}
          onPress={onLocationPress} />
      ) : null}
    </>
  );
});

export default MapboxGLWrapperDriverRouteMonitoring;
