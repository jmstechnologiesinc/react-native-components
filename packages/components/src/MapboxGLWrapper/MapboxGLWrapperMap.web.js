// The web map: the surface of `index.js` (@rnmapbox on native) rebuilt on react-map-gl v8 + mapbox-gl. index.web.js
// loads this module with import(), so its map engine (mapbox-gl, about 1.8 MB minified) and stylesheet reach the
// browser only when a screen shows a map, never with the app's first page.
//
// Moved from CustomerApp's web-stubs/mapbox-gl-wrapper.js, the host override that replaced the previous index.web.js
// (a monolithic GeoPositionTracker written against props nobody passes any more). Consumers use the composable
// <MapboxGLWrapper>{children}</MapboxGLWrapper> model; the mapping between @rnmapbox and react-map-gl is direct:
//
//     ShapeSource + LineLayer   ->  <Source type="geojson"> + <Layer type="line">
//     MarkerView / PointAnnot.  ->  <Marker>
//     Camera                    ->  useMap() + flyTo / fitBounds
//
// DriverRouteMonitoring is DELIBERATELY simpler than the native one: it does not port the overview->follow state
// machine (Uber-style follow camera, off-route detection, memoized remaining route). That exists for a full-screen
// phone map; in a 300px desktop box it adds nothing, and it depends on onMapIdle/onCameraChanged. The web version
// frames origin and destination, draws the route and moves the vehicle.
//
// Out of scope on purpose (used only by DriverApp, which the web stubs out entirely): DrawTurnByTurnRoute,
// BusinessIconMarker and HeatMap stay no-ops, in index.web.js.

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import Map, { GeolocateControl, Layer, Marker, Source, useMap } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3LightTheme, Text, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import { Config } from '../Config';
import MapboxGLWrapperContainer from './MapboxGLWrapperContainer';
import carIcon from './assets/car.png';

const DEFAULT_ZOOM = 15;
const CAR_SIZE = 40;
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12';

// react-map-gl applies `style` to the map's div as a DOM style, not an RN style. A StyleSheet.create id (a number in
// react-native-web) reaches it as garbage, the container stays at height 0 and the map is invisible although its
// canvas renders. Hence the plain object.
const MAP_DOM_STYLE = { width: '100%', height: '100%' };

const isCoordinate = (longitude, latitude) => Number.isFinite(longitude) && Number.isFinite(latitude);

// @rnmapbox hands onRegionDidChange a GeoJSON Feature whose `properties.isUserInteraction` tells the user's pan from a
// programmatic move. MapSelector reads both, so react-map-gl's events are repackaged in that same shape.
const toRegionFeature = (event) => {
    const center = event?.target?.getCenter?.();

    return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [center?.lng, center?.lat] },
        properties: {
            zoomLevel: event?.target?.getZoom?.(),
            isUserInteraction: Boolean(event?.originalEvent),
        },
    };
};

export const MapboxGLWrapperMap = forwardRef(
    (
        {
            style,
            children,
            onDidFinishLoadingMap,
            onRegionDidChange,
            onRegionIsChanging,
            onMapIdle,
            onCameraChanged,
            ...props
        },
        ref
    ) => {
        const mapRef = useRef(null);

        useImperativeHandle(ref, () => ({
            getMap: () => mapRef.current?.getMap?.(),
        }));

        return (
            <MapboxGLWrapperContainer style={style}>
                <Map
                    ref={mapRef}
                    // Read on render, not on import: the host configures it once before the first render (Config.web.js).
                    mapboxAccessToken={Config.MAPBOX_ACCESS_TOKEN}
                    mapStyle={MAP_STYLE}
                    style={MAP_DOM_STYLE}
                    attributionControl={false}
                    onLoad={onDidFinishLoadingMap}
                    onMove={onRegionIsChanging}
                    onMoveEnd={(event) => {
                        onRegionDidChange?.(toRegionFeature(event));
                        onCameraChanged?.(toRegionFeature(event));
                    }}
                    onIdle={onMapIdle}
                    {...props}
                >
                    {children}
                </Map>
            </MapboxGLWrapperContainer>
        );
    }
);

MapboxGLWrapperMap.displayName = 'MapboxGLWrapper';

// Takes @rnmapbox's prop shape (centerCoordinate / zoomLevel) and exposes the same imperative setCamera(), which is how
// MapSelector recenters on the GPS.
export const MapboxGLWrapperCamera = forwardRef(({ centerCoordinate, zoomLevel, animationDuration = 1000 }, ref) => {
    const { current: map } = useMap();

    const moveCamera = useCallback(
        ({ centerCoordinate: center, zoomLevel: zoom, animationDuration: duration = animationDuration }) => {
            if (!map || !center || !isCoordinate(center[0], center[1])) return;
            map.flyTo({ center, zoom: zoom ?? zoomLevel ?? DEFAULT_ZOOM, duration });
        },
        [map, animationDuration, zoomLevel]
    );

    useImperativeHandle(ref, () => ({ setCamera: moveCamera }), [moveCamera]);

    // Only the INITIAL framing. Reframing on every prop change would fight the user's pan, which is exactly what
    // MapPickerScreen needs to work.
    const hasCenteredRef = useRef(false);
    useEffect(() => {
        if (hasCenteredRef.current || !centerCoordinate) return;
        hasCenteredRef.current = true;
        moveCamera({ centerCoordinate, zoomLevel, animationDuration: 0 });
    }, [centerCoordinate, zoomLevel, moveCamera]);

    return null;
});

MapboxGLWrapperCamera.displayName = 'MapboxGLWrapperCamera';

export const MapboxGLWrapperBoundingBoxCamera = forwardRef(({ coordinates, snapPoint = 0 }, ref) => {
    const { current: map } = useMap();

    const fit = useCallback(() => {
        const points = (coordinates || []).filter((point) => point && isCoordinate(point[0], point[1]));
        if (!map || points.length === 0) return;

        if (points.length === 1) {
            map.flyTo({ center: points[0], zoom: DEFAULT_ZOOM, duration: 600 });
            return;
        }

        const lngs = points.map((point) => point[0]);
        const lats = points.map((point) => point[1]);

        map.fitBounds(
            [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
            ],
            // The bottom sheet covers the lower part of the canvas; snapPoint is its height, as on native, so the
            // framing lands in the visible area.
            { padding: { top: 60, left: 60, right: 60, bottom: 60 + snapPoint }, duration: 600, maxZoom: 16 }
        );
    }, [map, coordinates, snapPoint]);

    useImperativeHandle(ref, () => ({ fit }), [fit]);

    useEffect(fit, [fit]);

    return null;
});

MapboxGLWrapperBoundingBoxCamera.displayName = 'MapboxGLWrapperBoundingBoxCamera';

export const MapboxGLWrapperVehicleIconMarker = ({ longitude, latitude, rotation = 0 }) =>
    isCoordinate(longitude, latitude) ? (
        <Marker longitude={longitude} latitude={latitude} anchor="center">
            <Image
                source={carIcon}
                style={[styles.car, { transform: [{ rotate: `${rotation}deg` }] }]}
                resizeMode="contain"
            />
        </Marker>
    ) : null;

export const MapboxGLWrapperLocationTooltip = ({ latitude, longitude, title, onPress }) =>
    isCoordinate(longitude, latitude) ? (
        <Marker longitude={longitude} latitude={latitude} anchor="bottom" offset={[0, -28]}>
            <TouchableRipple onPress={onPress}>
                <View style={styles.tooltip}>
                    <Text variant="titleMedium">{title?.length > 20 ? `${title.substring(0, 20)}...` : title}</Text>
                    {onPress ? <MaterialCommunityIcons name="chevron-right" size={24} color="black" /> : null}
                </View>
            </TouchableRipple>
        </Marker>
    ) : null;

export const MapboxGLWrapperPointAnnotationMaterialIcon = ({ coordinate, iconName = 'map-marker', iconSize = 32 }) =>
    coordinate && isCoordinate(coordinate[0], coordinate[1]) ? (
        <Marker longitude={coordinate[0]} latitude={coordinate[1]} anchor="bottom">
            <MaterialCommunityIcons name={iconName} size={iconSize} color={MD3LightTheme.colors.primary} />
        </Marker>
    ) : null;

export const MapboxGLWrapperUserLocation = () => <GeolocateControl position="top-right" trackUserLocation />;

const routeFeature = (coordinates) => ({
    type: 'Feature',
    geometry: { type: 'LineString', coordinates },
    properties: {},
});

export const MapboxGLWrapperDriverRouteMonitoring = forwardRef(
    ({ originLocation, dropoffLocation, onLocationPress }, ref) => {
        const [route, setRoute] = useState([]);
        const [snapPoint, setSnapPoint] = useState(0);
        const boundingBoxRef = useRef(null);

        const origin = isCoordinate(originLocation?.longitude, originLocation?.latitude)
            ? [originLocation.longitude, originLocation.latitude]
            : null;
        const destination = isCoordinate(dropoffLocation?.longitude, dropoffLocation?.latitude)
            ? [dropoffLocation.longitude, dropoffLocation.latitude]
            : null;

        useImperativeHandle(ref, () => ({
            resetCamera: (nextSnapPoint) => {
                if (Number.isFinite(nextSnapPoint)) setSnapPoint(nextSnapPoint);
                boundingBoxRef.current?.fit();
            },
            setCameraSnapPoint: (nextSnapPoint) => {
                if (Number.isFinite(nextSnapPoint)) setSnapPoint(nextSnapPoint);
            },
            // Native uses these for the overview->follow transition, which does not exist here.
            onMapIdle: () => {},
            onCameraChanged: () => {},
        }));

        useEffect(() => {
            if (!origin || !destination) return;

            const url =
                `https://api.mapbox.com/directions/v5/mapbox/driving/` +
                `${origin[0]},${origin[1]};${destination[0]},${destination[1]}` +
                `?geometries=geojson&overview=full&access_token=${Config.MAPBOX_ACCESS_TOKEN}`;

            let cancelled = false;

            fetch(url)
                .then((response) => response.json())
                .then((json) => {
                    if (!cancelled && json.routes?.length) setRoute(json.routes[0].geometry.coordinates);
                })
                .catch((error) => console.log('[route] directions error:', error?.message || error));

            return () => {
                cancelled = true;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [origin?.[0], origin?.[1], destination?.[0], destination?.[1]]);

        const shape = useMemo(() => (route.length >= 2 ? routeFeature(route) : null), [route]);

        return (
            <>
                <MapboxGLWrapperBoundingBoxCamera
                    ref={boundingBoxRef}
                    snapPoint={snapPoint}
                    coordinates={[...(origin ? [origin] : []), ...(destination ? [destination] : [])]}
                />

                {shape ? (
                    <Source id="remaining-route" type="geojson" data={shape}>
                        <Layer
                            id="remaining-route-line"
                            type="line"
                            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                            paint={{ 'line-color': MD3LightTheme.colors.primary, 'line-width': 5 }}
                        />
                    </Source>
                ) : null}

                {origin ? <MapboxGLWrapperVehicleIconMarker longitude={origin[0]} latitude={origin[1]} /> : null}

                {origin && originLocation?.formattedAddress ? (
                    <MapboxGLWrapperLocationTooltip
                        title={originLocation.formattedAddress}
                        longitude={origin[0]}
                        latitude={origin[1]}
                        onPress={onLocationPress}
                    />
                ) : null}

                {destination ? <MapboxGLWrapperPointAnnotationMaterialIcon coordinate={destination} /> : null}
            </>
        );
    }
);

MapboxGLWrapperDriverRouteMonitoring.displayName = 'MapboxGLWrapperDriverRouteMonitoring';

const styles = StyleSheet.create({
    car: {
        width: CAR_SIZE,
        height: CAR_SIZE,
    },
    tooltip: {
        backgroundColor: MD3LightTheme.colors.background,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
