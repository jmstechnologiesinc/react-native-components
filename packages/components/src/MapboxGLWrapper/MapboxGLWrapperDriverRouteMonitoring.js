import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

import Config from 'react-native-config';
import MapboxGL from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MapboxGLWrapper from './MapboxGLWrapper';

// Uber-style follow camera: locked on the car at a close driving zoom.
const FOLLOW_ZOOM = 16;
const FOLLOW_ANIMATION_MS = 250;
// On open, show an overview (driver + destination) this long, then lock to follow.
const OVERVIEW_MS = 3500;
// Re-request the route from the Directions API ONLY when necessary: no route yet,
// or the driver has strayed this far from the fetched one (off-route / big jump).
// Normal progress ALONG the route needs zero requests -- the remaining line is
// sliced from the already-fetched geometry locally.
const OFF_ROUTE_METERS = 80;

const metersBetween = ([lng1, lat1], [lng2, lat2]) => {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
};

// Index of the route vertex closest to the driver (+ that distance): drives the
// remaining-route slice and off-route detection, all locally.
const nearestOnRoute = (route, point) => {
    let index = 0;
    let distance = Infinity;
    for (let i = 0; i < route.length; i++) {
        const d = metersBetween(route[i], point);
        if (d < distance) {
            distance = d;
            index = i;
        }
    }
    return { index, distance };
};

const lineFeatureCollection = (coordinates) => ({
    type: 'FeatureCollection',
    features: [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } }],
});

const MapboxGLWrapperDriverRouteMonitoring = forwardRef(({ originLocation, dropoffLocation, onLocationPress }, ref) => {
    // Full route geometry, fetched ONLY when necessary (see the effect below).
    const [route, setRoute] = useState([]);
    const fetchingRef = useRef(false);

    // Camera phase: overview (driver + destination framed) on open, then lock
    // into the follow so both are visible before it zooms in.
    const [following, setFollowing] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setFollowing(true), OVERVIEW_MS);
        return () => clearTimeout(timer);
    }, []);

    const liveOrigin = originLocation ? [originLocation.longitude, originLocation.latitude] : null;
    const destinationCoords =
        dropoffLocation &&
        Number.isFinite(dropoffLocation.longitude) &&
        Number.isFinite(dropoffLocation.latitude)
            ? [dropoffLocation.longitude, dropoffLocation.latitude]
            : null;

    // Fetch the route ONLY when necessary: nothing fetched yet, or the driver
    // has gone off the fetched route. Runs on movement but almost never fetches.
    useEffect(() => {
        if (!liveOrigin || !destinationCoords || fetchingRef.current) return;
        const needsFetch = route.length === 0 || nearestOnRoute(route, liveOrigin).distance > OFF_ROUTE_METERS;
        if (!needsFetch) return;

        fetchingRef.current = true;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${liveOrigin[0]},${liveOrigin[1]};${destinationCoords[0]},${destinationCoords[1]}?geometries=geojson&overview=full&access_token=${Config.MAPBOX_ACCESS_TOKEN}`;
        fetch(url)
            .then((r) => r.json())
            .then((json) => {
                if (json.routes?.length) {
                    setRoute(json.routes[0].geometry.coordinates);
                } else {
                    console.log('[route] no route returned:', json?.message);
                }
            })
            .catch((e) => console.log('[route] directions error:', e?.message || e))
            .finally(() => {
                fetchingRef.current = false;
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originLocation?.latitude, originLocation?.longitude, destinationCoords?.[0], destinationCoords?.[1]]);

    // Which vertex the driver is currently at. Cheap loop; runs per frame but the
    // heavy part (the shape below) is memoized off its RESULT, not this.
    const nearestIndex = route.length >= 2 && liveOrigin ? nearestOnRoute(route, liveOrigin).index : 0;

    // Remaining-route line, MEMOIZED on the vertex index -- it only rebuilds when
    // the driver actually PASSES a vertex, not on every ~30fps position update.
    // Keeping the ShapeSource `shape` object stable is what makes the line paint
    // reliably (a fresh object every frame made @rnmapbox re-upload the source
    // continuously and it never drew).
    const remainingShape = useMemo(() => {
        if (route.length < 2) return null;
        const coords = route.slice(nearestIndex);
        return coords.length > 1 ? lineFeatureCollection(coords) : null;
    }, [route, nearestIndex]);

    if (!originLocation) return null;

    const markerHeading = Number.isFinite(originLocation.heading) ? originLocation.heading : 0;

    return (
        <>
            {following ? (
                <MapboxGLWrapper.Camera
                    centerCoordinate={liveOrigin}
                    zoomLevel={FOLLOW_ZOOM}
                    animationMode="linearTo"
                    animationDuration={FOLLOW_ANIMATION_MS}
                />
            ) : (
                <MapboxGLWrapper.BoundingBoxCamera
                    coordinates={[liveOrigin, ...(destinationCoords ? [destinationCoords] : [])]}
                />
            )}

            {remainingShape ? (
                <MapboxGL.ShapeSource id="remaining-route" shape={remainingShape}>
                    <MapboxGL.LineLayer
                        id="remaining-route-line"
                        style={{
                            lineColor: MD3LightTheme.colors.primary,
                            lineWidth: 5,
                            lineCap: 'round',
                            lineJoin: 'round',
                        }}
                    />
                </MapboxGL.ShapeSource>
            ) : null}

            <MapboxGLWrapper.VehicleIconMarker
                id="driver-vehicle"
                longitude={liveOrigin[0]}
                latitude={liveOrigin[1]}
                rotation={markerHeading}
            />

            {originLocation?.formattedAddress ? (
                <MapboxGLWrapper.LocationTooltip
                    id="driver-eta"
                    anchor={{ x: 0.5, y: 2.6 }}
                    title={originLocation.formattedAddress}
                    longitude={liveOrigin[0]}
                    latitude={liveOrigin[1]}
                    onPress={onLocationPress}
                />
            ) : null}

            {destinationCoords ? (
                <MapboxGLWrapper.PointAnnotationMaterialIcon id="destination-point" coordinate={destinationCoords} />
            ) : null}

            {destinationCoords && dropoffLocation?.formattedAddress ? (
                <MapboxGLWrapper.LocationTooltip
                    id="destination-tooltip"
                    title={dropoffLocation.formattedAddress}
                    longitude={destinationCoords[0]}
                    latitude={destinationCoords[1]}
                    onPress={onLocationPress}
                />
            ) : null}
        </>
    );
});

export default MapboxGLWrapperDriverRouteMonitoring;
