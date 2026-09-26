import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { Portal, Snackbar } from '@jmstechnologiesinc/react-native-paper';

/**
 * @typedef {object} SnackbarOptions
 * @property {{label: string, onPress: () => void}} [action]
 * @property {number} [duration] ms; Paper's default when absent
 */

const SnackbarContext = createContext(null);

/**
 * Snackbars without redux: one at a time, in a Paper `Portal` (the fork's Snackbar is not portaled), the
 * rest queued in order. Each dismisses on its timeout, its action or `dismiss()`. Place it under Paper's
 * `Provider` (the Portal host), above whatever calls `useSnackbar`.
 *
 * @param {{children?: React.ReactNode, testID?: string}} props the visible snackbar's testID (default
 *     `snackbar`)
 */
export const SnackbarProvider = ({ children, testID = 'snackbar' }) => {
    const [queue, setQueue] = useState([]);
    const nextId = useRef(0);

    const show = useCallback((message, options = {}) => {
        nextId.current += 1;
        const entry = { id: nextId.current, message, ...options };
        setQueue((current) => [...current, entry]);
        return entry.id;
    }, []);
    const dismiss = useCallback(() => setQueue((current) => current.slice(1)), []);

    const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);
    const [current] = queue;

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            <Portal>
                {current ? (
                    <Snackbar
                        key={current.id}
                        visible
                        onDismiss={dismiss}
                        action={current.action}
                        duration={current.duration}
                        testID={testID}
                    >
                        {current.message}
                    </Snackbar>
                ) : null}
            </Portal>
        </SnackbarContext.Provider>
    );
};

/**
 * `show(message, {action?, duration?})` queues a snackbar and returns its id; `dismiss()` closes the one
 * on screen. Throws outside a `SnackbarProvider`.
 *
 * @returns {{show: (message: string, options?: SnackbarOptions) => number, dismiss: () => void}}
 */
export const useSnackbar = () => {
    const value = useContext(SnackbarContext);
    if (!value) throw new Error('SnackbarProvider is missing above this component');
    return value;
};

export default SnackbarProvider;
