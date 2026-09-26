import { Platform } from 'react-native';

// react-native-web 0.21 no longer reads `accessibilityState`, and reads `accessibilityRole` /
// `accessibilityLabel` only behind a deprecation warning: a selected, checked or disabled state set only
// there never reaches the DOM, so a screen reader on the web never hears it. These props therefore carry
// both vocabularies: `accessibilityState` everywhere (native reads it; react-native-web drops it without a
// warning) and, on the web only, the ARIA twins in place of the deprecated role and label. The native
// tree gets exactly the `accessibility*` props it always had.

const withoutUndefined = (props) =>
    Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));

export const isWeb = () => Platform.OS === 'web';

/**
 * `{ role?, label?, selected?, checked?, disabled?, current? }` → the props for the element that carries
 * the semantics. `current` (e.g. `'page'`) is web-only: native has no `aria-current`.
 */
export const accessibilityProps = ({ role, label, selected, checked, disabled, current } = {}) => {
    const state = withoutUndefined({ selected, checked, disabled });
    const accessibilityState = Object.keys(state).length ? state : undefined;

    if (isWeb()) {
        return withoutUndefined({
            role,
            'aria-label': label,
            'aria-selected': selected,
            'aria-checked': checked,
            'aria-disabled': disabled,
            'aria-current': current,
            accessibilityState,
        });
    }

    return withoutUndefined({ accessibilityRole: role, accessibilityLabel: label, accessibilityState });
};
