import React, { useRef } from 'react';
import MapboxGL from '@rnmapbox/maps';

const images = {
  restaurantIcon: require('./assets/restaurant.png'),
  carIcon: require('./assets/car.png'),
};

const MapboxGLWrapperSingleIconMarker = ({ 
  id, 
  title,
  iconKey,
  longitude,
  latitude,
  rotation = 0 
}) => {
  const shapeSourceRef = useRef(null);
  const symbolLayerRef = useRef(null);

  const featureCollection = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {
        id: id,
        title: title,
        iconKey: iconKey,
      },
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    }],
  };

  return (
    <MapboxGL.ShapeSource
      id={`source-${id}`}
      ref={shapeSourceRef}
      shape={featureCollection}>
      <MapboxGL.Images images={images} />

      <MapboxGL.SymbolLayer
        id={`layer-${id}`}
        ref={symbolLayerRef}
        style={{
          iconImage: ['get', 'iconKey'],
          iconSize: 0.5,
          iconRotate: rotation,
          iconAllowOverlap: true,
          iconImage: ['get', 'iconKey'],
          iconSize: 0.5,
          iconRotate: rotation,
          iconAllowOverlap: true,
          textField: ['get', 'title'],
          textSize: 12,
          textOffset: [0, 1.2],
          textAllowOverlap: true,
          textAnchor: 'top',
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default MapboxGLWrapperSingleIconMarker;
