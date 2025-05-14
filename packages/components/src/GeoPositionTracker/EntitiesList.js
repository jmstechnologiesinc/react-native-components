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
          defaultIcon:    require('./tracking/car.png')  
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
              'restaurant',  'restaurantIcon',
              /* default */   'defaultIcon'
            ],
            iconSize: 0.5,
            iconRotate: rotation,
            iconAllowOverlap: true,
            textField: ['get', 'title'],     
            textSize: 12,
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
