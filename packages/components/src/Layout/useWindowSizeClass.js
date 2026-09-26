import { useWindowDimensions } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

import { sizeClassOf, tokenScale } from './metrics';

/**
 * The MD3 window size class of the current window, live: it follows window resizes and rotations
 * (`useWindowDimensions`).
 *
 * The class is read from the window's raw width: MD3 breakpoints are dp, and on the web a dp is a CSS
 * pixel. When Paper scales its tokens (the fork's size-matters scaling on the web), components and
 * panes grow, but the window a person has does not: classifying by the scaled width would treat a
 * 1024px laptop as "medium" and demand ~1850px for three panes. `scale` is still returned so a host
 * can size things with it.
 *
 * @returns {{sizeClass: string, width: number, height: number, scale: number}} `width`/`height` are the
 *     window's, unscaled; `scale` is the theme's token scale
 */
export const useWindowSizeClass = () => {
    const { width, height } = useWindowDimensions();
    const scale = tokenScale(useTheme());
    return { sizeClass: sizeClassOf(width), width, height, scale };
};

export default useWindowSizeClass;
