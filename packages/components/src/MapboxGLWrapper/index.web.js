// The web twin of `index.js`: the same composable surface, <MapboxGLWrapper>{children}</MapboxGLWrapper> with its
// statics. The map itself (MapboxGLWrapperMap.web.js: react-map-gl, mapbox-gl and its stylesheet) is loaded with
// import() the first time a map renders. The package's barrel exports this wrapper, so a static import would put the
// map engine in every page of the host; Expo splits the web bundle at import() (docs.expo.dev, customizing Metro), as
// the host's lazy() screens do.
//
// Each map part is lazy() inside a Suspense of its own: the map shows its empty box while its code arrives, and a
// part never pulls the whole map back to that box (all parts come from the same chunk, loaded once).

import React, { Suspense, forwardRef, lazy } from 'react';

import MapboxGLWrapperContainer from './MapboxGLWrapperContainer';
import MapboxGLWrapperLocationSelectorPin from './MapboxGLWrapperLocationSelectorPin';
import MapboxGLWrapperResetToInitialPositionIcon from './MapboxGLWrapperResetToInitialPositionIcon';

const loadMap = () => import('./MapboxGLWrapperMap');

const lazyMapPart = (exportName) => lazy(() => loadMap().then((module) => ({ default: module[exportName] })));

/** A map part, rendered once the map's code has arrived; nothing in its place until then. */
const mapPart = (exportName, displayName) => {
    const Part = lazyMapPart(exportName);
    const MapPart = forwardRef((props, ref) => (
        <Suspense fallback={null}>
            <Part ref={ref} {...props} />
        </Suspense>
    ));
    MapPart.displayName = displayName;

    return MapPart;
};

const LazyMap = lazyMapPart('MapboxGLWrapperMap');

const MapboxGLWrapper = forwardRef(({ style, ...props }, ref) => (
    <Suspense fallback={<MapboxGLWrapperContainer style={style} />}>
        <LazyMap ref={ref} style={style} {...props} />
    </Suspense>
));

MapboxGLWrapper.displayName = 'MapboxGLWrapper';

const NoopMapComponent = () => null;

export default Object.assign(MapboxGLWrapper, {
    Camera: mapPart('MapboxGLWrapperCamera', 'MapboxGLWrapperCamera'),
    BoundingBoxCamera: mapPart('MapboxGLWrapperBoundingBoxCamera', 'MapboxGLWrapperBoundingBoxCamera'),
    FolowUserLocation: mapPart('MapboxGLWrapperUserLocation', 'MapboxGLWrapperUserLocation'),
    VehicleIconMarker: mapPart('MapboxGLWrapperVehicleIconMarker', 'MapboxGLWrapperVehicleIconMarker'),
    PointAnnotationMaterialIcon: mapPart(
        'MapboxGLWrapperPointAnnotationMaterialIcon',
        'MapboxGLWrapperPointAnnotationMaterialIcon'
    ),
    LocationTooltip: mapPart('MapboxGLWrapperLocationTooltip', 'MapboxGLWrapperLocationTooltip'),
    DriverRouteMonitoring: mapPart('MapboxGLWrapperDriverRouteMonitoring', 'MapboxGLWrapperDriverRouteMonitoring'),
    ResetToInitialPositionIcon: MapboxGLWrapperResetToInitialPositionIcon,
    LocationSelectorPin: MapboxGLWrapperLocationSelectorPin,
    // DriverApp only, which the web stubs out entirely.
    DrawTurnByTurnRoute: NoopMapComponent,
    BusinessIconMarker: NoopMapComponent,
    HeatMap: NoopMapComponent,
});
