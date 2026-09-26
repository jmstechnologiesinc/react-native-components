import { useEffect, useState } from 'react';

const MINUTE = 60 * 1000;

/**
 * The current instant (epoch ms), refreshed every `intervalMs` so relative times and deadlines shown on
 * screen stay current without a reload. Presentation only: nothing should be decided from it.
 *
 * @param {number} [intervalMs] one minute by default
 * @returns {number}
 */
export const useNow = (intervalMs = MINUTE) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(timer);
    }, [intervalMs]);
    return now;
};

export default useNow;
