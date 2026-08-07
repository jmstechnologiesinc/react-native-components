import { useEffect, useRef, useState } from 'react';

// Glides the driver marker from its current on-screen position to each freshly
// received target over ~the publish cadence (default 4s), instead of teleporting
// on every Centrifugo publication. Heading is eased along the shortest angular
// path so the vehicle icon rotates naturally (no 359deg -> 0deg spin). Emits at
// ~30fps -- smooth to the eye, far lighter than 60fps marker re-renders.
//
// Robust to updates that arrive mid-glide: the next target animates FROM the
// current interpolated position (not the last raw fix), so there is never a jump.
const EMIT_INTERVAL_MS = 1000 / 30;

const shortestTurn = (from, to) => from + (((to - from + 540) % 360) - 180);

// Compass bearing (deg, 0=N clockwise) from one lng/lat point to another.
const bearingBetween = (from, to) => {
    const toRad = (d) => (d * Math.PI) / 180;
    const toDeg = (r) => (r * 180) / Math.PI;
    const dLon = toRad(to.longitude - from.longitude);
    const y = Math.sin(dLon) * Math.cos(toRad(to.latitude));
    const x =
        Math.cos(toRad(from.latitude)) * Math.sin(toRad(to.latitude)) -
        Math.sin(toRad(from.latitude)) * Math.cos(toRad(to.latitude)) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

export const useSmoothDriverLocation = (target, duration = 4000) => {
    const [value, setValue] = useState(null);
    const fromRef = useRef(null);
    const currentRef = useRef(null);
    const rafRef = useRef(null);
    const startRef = useRef(0);
    const lastEmitRef = useRef(0);

    useEffect(() => {
        if (!target || !Number.isFinite(target.latitude) || !Number.isFinite(target.longitude)) {
            return undefined;
        }

        // First fix: snap into place, nothing to animate from.
        if (!currentRef.current) {
            currentRef.current = target;
            fromRef.current = target;
            setValue(target);
            return undefined;
        }

        fromRef.current = currentRef.current; // animate from where we ARE right now

        // Which way the car should face. Prefer a valid GPS heading from the
        // payload; otherwise derive it from the actual movement bearing --
        // delivery / turn-by-turn fixes carry no heading, so without this the car
        // would point along the stale initial route bearing instead of the way
        // it's driving. When barely moving, keep the last heading (no spinning).
        const movedEnough =
            Math.abs(target.latitude - fromRef.current.latitude) +
                Math.abs(target.longitude - fromRef.current.longitude) >
            0.00003; // ~3m
        const prevHeading = Number.isFinite(fromRef.current.heading) ? fromRef.current.heading : 0;
        const resolvedHeading =
            Number.isFinite(target.heading) && target.heading >= 0
                ? target.heading
                : movedEnough
                  ? bearingBetween(fromRef.current, target)
                  : prevHeading;

        const fromHeading = prevHeading;
        const toHeading = shortestTurn(fromHeading, resolvedHeading);

        startRef.current = Date.now();
        lastEmitRef.current = 0;
        cancelAnimationFrame(rafRef.current);

        const tick = () => {
            const now = Date.now();
            const t = Math.min(1, (now - startRef.current) / duration);
            const eased = t * (2 - t); // easeOutQuad

            const next = {
                ...target, // carry formattedAddress / ETA etc.
                latitude: fromRef.current.latitude + (target.latitude - fromRef.current.latitude) * eased,
                longitude: fromRef.current.longitude + (target.longitude - fromRef.current.longitude) * eased,
                heading: fromHeading + (toHeading - fromHeading) * eased,
            };
            currentRef.current = next;

            if (t >= 1 || now - lastEmitRef.current >= EMIT_INTERVAL_MS) {
                lastEmitRef.current = now;
                setValue(next);
            }
            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target?.latitude, target?.longitude, target?.heading, duration]);

    return value;
};

export default useSmoothDriverLocation;
