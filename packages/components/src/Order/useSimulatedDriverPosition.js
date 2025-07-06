import { useEffect, useRef, useState } from 'react';

const interpolate = (start, end, factor) => start + (end - start) * factor;

export const useSimulatedDriverPosition = (origin, destination, durationInMs = 180000, updateInterval = 1000) => {
    const [position, setPosition] = useState(origin);
    const currentStepRef = useRef(0);

    useEffect(() => {
        const totalSteps = durationInMs / updateInterval;

        const interval = setInterval(() => {
            const step = currentStepRef.current;

            if (step > totalSteps) {
                clearInterval(interval);
                setPosition(destination);
                return;
            }

            const factor = step / totalSteps;
            const lat = interpolate(origin.latitude, destination.latitude, factor);
            const lng = interpolate(origin.longitude, destination.longitude, factor);

            setPosition({ latitude: lat, longitude: lng });

            currentStepRef.current += 1;
        }, updateInterval);

        return () => clearInterval(interval);
    }, [origin, destination, durationInMs, updateInterval]);

    return position;
};
