import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import Config from 'react-native-config';
import MapboxGL from '@rnmapbox/maps';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import MapboxGLWrapper from './MapboxGLWrapper';

// Uber-style follow camera: locked on the car at a close driving zoom.
const FOLLOW_ZOOM = 16;
const FOLLOW_ANIMATION_MS = 250;
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

// `autoFollow` is the Uber-style behaviour: frame driver + destination until
// that overview has settled on screen (map idle) and the driver moves again,
// then lock the camera onto the car. That is right for live trip tracking,
// but wrong for a screen where the user is still COMPARING drivers — there
// the destination must stay on screen, so those callers pass false.
const MapboxGLWrapperDriverRouteMonitoring = forwardRef(({ originLocation, dropoffLocation, onLocationPress, autoFollow = true }, ref) => {
    // Full route geometry, fetched ONLY when necessary (see the effect below).
    const [route, setRoute] = useState([]);
    const fetchingRef = useRef(false);

    // How much of the map is covered from the bottom by the caller's bottom
    // sheet. BOTH camera phases have to honour it, or the driver and the
    // destination are framed into a strip the sheet is sitting on top of.
    //
    // Regression note: before the follow-camera split this component rendered
    // `<BoundingBoxCamera ref={ref} .../>`, so the caller's ref WAS the
    // camera's. The split dropped `ref={ref}` and left `forwardRef` in place,
    // which silently turned every caller's setCameraSnapPoint into a no-op —
    // and a TypeError for callers that did not null-check.
    const [cameraSnapPoint, setCameraSnapPoint] = useState(0);

    // Camera phase: overview (driver + destination framed), then — when the
    // caller wants Uber-style behaviour — lock onto the car. `overviewNonce`
    // re-arms the overview: bumping it drops out of follow AND resets the
    // settle/gesture latches below, so a recentre during a live trip resumes
    // following afterwards (permanently killing follow mode would silently
    // change the screen's behaviour for the rest of the session).
    const [following, setFollowing] = useState(false);
    const [overviewNonce, setOverviewNonce] = useState(0);
    // True while a user gesture owns the camera: render NO camera component,
    // so neither overview nor follow fights the user's pan. An explicit
    // recentre (resetCamera) is the only way back.
    const [cameraFree, setCameraFree] = useState(false);

    // Origin counts only with finite coordinates -- some callers pass a
    // placeholder object with undefined lat/lng while no driver is selected
    // (CheckoutScreen), which must not reach the camera/marker as NaN.
    const hasOrigin =
        Boolean(originLocation) &&
        Number.isFinite(originLocation.latitude) &&
        Number.isFinite(originLocation.longitude);

    // Overview -> follow is event-driven, no wall-clock timers: follow engages
    // only once the overview framing has actually settled on screen (map idle,
    // recorded through the handle below) AND the driver has moved again. A
    // ref, not state: settling is an edge event consumed by the movement
    // effect and must not re-render the map mid-animation.
    const overviewSettledRef = useRef(false);

    // (Re-)arm the overview whenever it re-frames: on gaining the first fix or
    // on an explicit recentre (overviewNonce). Resetting the latches here
    // keeps a pre-origin map idle or a stale gesture from leaking into the
    // fresh overview.
    useEffect(() => {
        setFollowing(false);
        setCameraFree(false);
        overviewSettledRef.current = false;
    }, [autoFollow, hasOrigin, overviewNonce]);

    // Engage follow on driver movement once the overview has settled. Keying
    // on the position stream instead of a clock means a parked driver keeps
    // the driver+destination overview (there is nothing to chase yet); a
    // moving one is followed from their first post-overview fix.
    useEffect(() => {
        if (!autoFollow || !hasOrigin || cameraFree) return;
        if (overviewSettledRef.current) setFollowing(true);
    }, [originLocation?.latitude, originLocation?.longitude, autoFollow, hasOrigin, cameraFree]);

    const boundingBoxCameraRef = useRef(null);

    // State flows down, events go through the handle — the split React
    // reserves refs for (scrollTo, focus, camera moves):
    //   - setCameraSnapPoint is continuous sheet-position STATE; it reaches
    //     both cameras declaratively (the `snapPoint` prop / follow padding).
    //   - resetCamera is a one-shot EVENT, and it cannot be modelled as
    //     props: after the user pans the map away, `bounds` and `snapPoint`
    //     are unchanged, so no re-render will ever move the camera back —
    //     only the camera's own imperative API re-frames in that case.
    // While `following`, the bounding-box camera is unmounted (ref null, the
    // `?.` no-ops) and the nonce-driven remount does the framing instead.
    useImperativeHandle(
        ref,
        () => ({
            setCameraSnapPoint: (snapPoint) =>
                setCameraSnapPoint(Number.isFinite(snapPoint) ? snapPoint : 0),
            resetCamera: (snapPoint) => {
                const nextSnapPoint = Number.isFinite(snapPoint) ? snapPoint : cameraSnapPoint;
                setCameraSnapPoint(nextSnapPoint);
                setOverviewNonce((nonce) => nonce + 1);
                boundingBoxCameraRef.current?.setCameraSnapPoint(nextSnapPoint);
            },
            // Map lifecycle, forwarded by the host that owns the MapView (the
            // events-through-the-handle side of the split above):
            // - onMapIdle: the overview framing finished animating -> follow
            //   may engage on the driver's next movement.
            // - onCameraChanged: while a gesture is active the user owns the
            //   camera -- release it entirely until an explicit recentre.
            onMapIdle: () => {
                overviewSettledRef.current = true;
            },
            onCameraChanged: (state) => {
                if (!state?.gestures?.isGestureActive) return;
                setFollowing(false);
                setCameraFree(true);
            },
        }),
        [cameraSnapPoint]
    );

    const liveOrigin = hasOrigin ? [originLocation.longitude, originLocation.latitude] : null;
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

    const markerHeading = Number.isFinite(originLocation?.heading) ? originLocation.heading : 0;

    return (
        <>
            {following && liveOrigin ? (
                <MapboxGLWrapper.Camera
                    centerCoordinate={liveOrigin}
                    zoomLevel={FOLLOW_ZOOM}
                    // Without this the follow camera centres the car in the FULL
                    // map viewport, i.e. behind the bottom sheet. Padding the
                    // covered strip lifts it into the visible part.
                    padding={{
                        paddingTop: 0,
                        paddingRight: 0,
                        paddingLeft: 0,
                        paddingBottom: cameraSnapPoint,
                    }}
                    animationMode="linearTo"
                    animationDuration={FOLLOW_ANIMATION_MS}
                />
            ) : cameraFree ? null : (
                <MapboxGLWrapper.BoundingBoxCamera
                    ref={boundingBoxCameraRef}
                    snapPoint={cameraSnapPoint}
                    coordinates={[...(liveOrigin ? [liveOrigin] : []), ...(destinationCoords ? [destinationCoords] : [])]}
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

            {liveOrigin ? (
                <MapboxGLWrapper.VehicleIconMarker
                    id="driver-vehicle"
                    longitude={liveOrigin[0]}
                    latitude={liveOrigin[1]}
                    rotation={markerHeading}
                />
            ) : null}

            {liveOrigin && originLocation?.formattedAddress ? (
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
