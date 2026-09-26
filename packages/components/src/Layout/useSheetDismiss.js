import { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

import { isWeb } from '../accessibility';
import { useModalFocus } from '../useModalFocus';

/**
 * The dismiss contract of a modal sheet. On the web: `useModalFocus` (focus in, Tab trapped, Esc
 * dismisses, focus back to the opener); the returned callback ref goes on the sheet's surface. On
 * Android: the hardware back button dismisses the open sheet. Elsewhere nothing.
 *
 * @param {{visible: boolean, onDismiss?: () => void}} options
 * @returns {?((node: any) => void)} the ref for the sheet's surface on the web, else undefined
 */
export const useSheetDismiss = ({ visible, onDismiss }) => {
    const web = isWeb();
    const ref = useModalFocus({ visible: Boolean(visible) && web, onDismiss });

    useEffect(() => {
        if (!visible || Platform.OS !== 'android' || !onDismiss) return undefined;
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            onDismiss();
            return true;
        });
        return () => subscription.remove();
    }, [visible, onDismiss]);

    return web ? ref : undefined;
};

export default useSheetDismiss;
