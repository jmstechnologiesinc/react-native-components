import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// The keyboard contract of a modal surface on the web: focus moves into it
// when it opens, Tab stays inside, Esc dismisses it, and focus returns to
// what had it before (WAI-ARIA dialog pattern). Paper's `Portal`/`Modal` do
// none of this, and their `BackHandler` is a no-op on the web.
//
// Native is untouched: off the web the hook does nothing and the ref it
// returns is never attached by the components that use it.

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

const focusablesIn = (node) => Array.from(node.querySelectorAll(FOCUSABLE));

const hasDocument = () => Platform.OS === 'web' && typeof document !== 'undefined';

// The open modal surfaces, innermost last: only the innermost one handles the
// keyboard, so Esc in a dialog opened over a sheet closes the dialog only.
const openModals = [];

/**
 * @param {{visible: boolean, onDismiss?: () => void}} options `onDismiss`
 *     absent (a busy dialog, say) makes Esc do nothing
 * @returns {(node: any) => void} a callback ref for the modal surface (a DOM
 *     node under react-native-web). A callback ref because Paper's `Portal`
 *     mounts its children a render later than the component's own effects.
 */
export const useModalFocus = ({ visible, onDismiss }) => {
    const [container, setContainer] = useState(null);
    const onDismissRef = useRef(onDismiss);
    onDismissRef.current = onDismiss;
    // Whatever had focus when the modal opened; captured before the portal
    // content mounts.
    const openerRef = useRef(null);
    const tokenRef = useRef(null);
    if (!tokenRef.current) tokenRef.current = {};

    useEffect(() => {
        if (!visible || !hasDocument()) return undefined;
        const token = tokenRef.current;
        openerRef.current = document.activeElement;
        openModals.push(token);
        return () => {
            const index = openModals.lastIndexOf(token);
            if (index >= 0) openModals.splice(index, 1);
            const opener = openerRef.current;
            openerRef.current = null;
            if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
        };
    }, [visible]);

    useEffect(() => {
        if (!visible || !hasDocument()) return undefined;
        const token = tokenRef.current;

        if (container?.querySelectorAll) {
            const [first] = focusablesIn(container);
            if (first) {
                first.focus();
            } else {
                container.setAttribute('tabindex', '-1');
                container.focus();
            }
        }

        const onKeyDown = (event) => {
            if (openModals[openModals.length - 1] !== token) return;
            if (event.key === 'Escape') {
                event.stopPropagation();
                onDismissRef.current?.();
                return;
            }
            if (event.key !== 'Tab' || !container?.querySelectorAll) return;
            const focusables = focusablesIn(container);
            if (!focusables.length) {
                event.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const inside = container.contains?.(document.activeElement);
            if (!inside) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [container, visible]);

    return setContainer;
};

export default useModalFocus;
