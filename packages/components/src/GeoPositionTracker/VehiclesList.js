import React, { useRef, useEffect, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';

const VehiclesList = ({ vehicleListPositions, filterVehiclePositions }) => {
  const shapeSourceRef = useRef(null);
  const imagesRef = useRef(null);
  const symbolLayerRefs = useRef([]);

  const [vehicles, setVehicles] = useState(vehicleListPositions);

  useEffect(() => {

    const newVehicles = filterVehiclePositions !== undefined ? filterVehiclePositions : vehicleListPositions;
    setVehicles(newVehicles);
  }, [filterVehiclePositions, vehicleListPositions]);

  const vehiclesFeatureCollection = {
    type: 'FeatureCollection',
    features: vehicles.map((car, index) => ({
      type: 'Feature',
      properties: {
        id: `vehicle-${index}`,
        type: 'car',
        image: require('./tracking/car.png'),
      },
      geometry: {
        type: 'Point',
        coordinates: [car.longitud, car.latitud],
      },
    })),
  };

  useEffect(() => {
    if (shapeSourceRef.current) {
      shapeSourceRef.current.setNativeProps({
        shape: vehiclesFeatureCollection,
      });
    }
  }, [vehicles]);

  return (
    <MapboxGL.ShapeSource
      id="vehiclesSource"
      ref={shapeSourceRef}
      shape={vehiclesFeatureCollection}
    >

      <MapboxGL.Images
        ref={imagesRef}
        images={{
          carIcon: require('./tracking/car.png'),
        }}
      />
      {vehicles.map((car, index) => (
        <MapboxGL.SymbolLayer
          key={`vehicle-${index}`}
          id={`vehicleLayer-${index}`}
          ref={(el) => (symbolLayerRefs.current[index] = el)}
          style={{
            iconImage: 'carIcon',
            iconSize: 0.5,
            iconAllowOverlap: true,
          }}
        />
      ))}
    </MapboxGL.ShapeSource>
  );
};

export default VehiclesList;
