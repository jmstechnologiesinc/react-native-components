import React from 'react';

import MapboxGL from '@rnmapbox/maps';

export function MapboxGLWrapperHeatMap({
    coordinates
}) {
    const geojson = {
        type: 'FeatureCollection',
        features: coordinates.map(point => ({
            type: 'Feature',
            properties: { id: point.id, title: point.title, weight: 2 }, // weight controls intensity
            geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
            },
        })),
    };

    return (
        <MapboxGL.ShapeSource id="heatmapSource" shape={geojson}>
            <MapboxGL.HeatmapLayer
                id="heatmapLayer"
                sourceID="heatmapSource"
                style={{
                    heatmapWeight: ['get', 'weight'],
                    heatmapIntensity: 4,
                    heatmapRadius: 70, // try 50-70 pixels to approximate 5 miles at zoom 11
                    heatmapColor: [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(33,102,172,0)',
                    0.2, 'rgb(103,169,207)',
                    0.4, 'rgb(209,229,240)',
                    0.6, 'rgb(253,219,199)',
                    0.8, 'rgb(239,138,98)',
                    1, 'rgb(178,24,43)',
                    ],
                    heatmapOpacity: 0.2,
                }}/>
        </MapboxGL.ShapeSource>
  );
}
export default MapboxGLWrapperHeatMap