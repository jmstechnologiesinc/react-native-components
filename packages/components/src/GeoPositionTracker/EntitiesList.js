import React, { useRef, useEffect, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';


const EntitiesList = ({
  entityListPositions,
  filterEntityPositions,
  rotation
}) => {

  const shapeSourceRef = useRef(null);
  const imagesRef = useRef(null);
  const symbolLayerRefs = useRef([]);

  const [entities, setEntities] = useState(entityListPositions);

  useEffect(() => {
    const updatedEntities = filterEntityPositions ?? entityListPositions;
    setEntities(updatedEntities);
  }, [filterEntityPositions, entityListPositions]);

  const entitiesFeatureCollection = {
    type: 'FeatureCollection',
    features: entities.map((item, index) => ({
      type: 'Feature',
      properties: {
        id: `entity-${index}`,
        title: item.title,
        type: item.type,

      },
      geometry: {
        type: 'Point',
        coordinates: [item.longitude, item.latitude]
      }
    }))
  };

  useEffect(() => {
    if (shapeSourceRef.current) {
      shapeSourceRef.current.setNativeProps({ shape: entitiesFeatureCollection });
    }
  }, [entitiesFeatureCollection]);

  return (
    <MapboxGL.ShapeSource
      id="entitiesSource"
      ref={shapeSourceRef}
      shape={entitiesFeatureCollection}
    >
      <MapboxGL.Images
        ref={imagesRef}
        images={{
          restaurantIcon: require('./tracking/restaurant.png'),
          defaultIcon: require('./tracking/car.png')
        }}
      />

      {entities.map((item, index) => (
        <MapboxGL.SymbolLayer
          key={`entity-${index}`}
          id={`entityLayer-${index}`}
          ref={(el) => (symbolLayerRefs.current[index] = el)}
          style={{
            iconImage: [
              'match',
              ['get', 'type'],
              'restaurant', 'restaurantIcon',
              /* default */   'defaultIcon'
            ],
            iconSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0.3,   
              16, 0.4,
              17, 0.5,
              18, 0.6,
              19, 0.7,
              20, 0.8,   
            ],
            iconRotate: rotation,
            iconAllowOverlap: true,
            textField: ['get', 'title'],
            textSize: [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,    
              16, 9,    
              17, 14,
              18, 16,
              19, 18,
              20, 20,    
            ],
            textOffset: [0, 1.2],
            textAllowOverlap: true,
            textAnchor: 'top'
          }}
        />
      ))}
    </MapboxGL.ShapeSource>
  );
};

export default EntitiesList;
