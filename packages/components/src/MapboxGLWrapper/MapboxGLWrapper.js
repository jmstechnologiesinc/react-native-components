import React from 'react';

import MapboxGL from '@rnmapbox/maps';
import { Config } from '../Config';

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN);
MapboxGL.setTelemetryEnabled(false);

const MapboxGLWrapper = ({ style, children, ...props }) => (
    <MapboxGL.MapView
        style={[{ flex: 1 }, style]}
        styleURL={MapboxGL.StyleURL.Street}
        zoomEnabled={true}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
        {...props}
    >
        {children}
    </MapboxGL.MapView>
);

const MapboxGLWrapperCamera = ({ ...props }) => <MapboxGL.Camera {...props} />;

const MapboxGLWrapperUserLocation = ({
    animated = true,
    isAndroidRenderMode = true,
    showsUserHeadingIndicator = true,
}) => (
    <MapboxGL.UserLocation
        animated={animated}
        {...(isAndroidRenderMode && { androidRenderMode: 'gps' })}
        showsUserHeadingIndicator={showsUserHeadingIndicator}
    />
);

export { MapboxGLWrapperUserLocation, MapboxGLWrapperCamera };
export default MapboxGLWrapper;
