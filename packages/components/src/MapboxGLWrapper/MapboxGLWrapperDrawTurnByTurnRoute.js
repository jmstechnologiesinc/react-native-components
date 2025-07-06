import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MapboxGLWrapper from './index';

const MapboxGLWrapperDrawTurnByTurnRoute = ({ route, destinationCoords, driverHeading, turnByTurnOriginLocation }) => {
    return route ? (
        <>
            <MapboxGL.ShapeSource id="routeSource" shape={route}>
                <MapboxGL.LineLayer
                    id="routeLine"
                    style={{ lineColor: MD3LightTheme.colors.primary, lineWidth: 4, lineOffset: -2 }}
                />
            </MapboxGL.ShapeSource>

            <MapboxGLWrapper.VehicleIconMarker
                longitude={turnByTurnOriginLocation[0]}
                latitude={turnByTurnOriginLocation[1]}
                rotation={driverHeading}
            />

            {destinationCoords?.length > 0 ? (
                <MapboxGLWrapper.PointAnnotationMaterialIcon
                    id="tbt-drop-off-location-point-anotation"
                    coordinate={destinationCoords}
                />
            ) : null}
        </>
    ) : null;
};

export default MapboxGLWrapperDrawTurnByTurnRoute;
