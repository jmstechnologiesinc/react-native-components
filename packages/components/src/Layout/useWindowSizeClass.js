import { useWindowDimensions } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

import { sizeClassOf, tokenScale } from './metrics';

/**
 * The MD3 window size class of the current window, live: it follows window resizes and rotations
 * (`useWindowDimensions`).
 *
 * The class is read from the window's width in the theme's dp (`width / tokenScale(theme)`), the unit
 * the panes are sized in: when Paper scales its tokens by 1.16, a window must be 1.16× wider to hold the
 * same panes. With an identity scale this is MD3's table on the raw width.
 *
 * @returns {{sizeClass: string, width: number, height: number, scale: number}} `width`/`height` are the
 *     window's, unscaled; `scale` is the theme's token scale
 */
export const useWindowSizeClass = () => {
    const { width, height } = useWindowDimensions();
    const scale = tokenScale(useTheme());
    return { sizeClass: sizeClassOf(width / scale), width, height, scale };
};

export default useWindowSizeClass;
