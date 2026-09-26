import { useTheme } from '@jmstechnologiesinc/react-native-paper';

// MD3 pane geometry (canvas «MD3 layouts v1»), expressed in the Paper theme's tokens.
//
// Every size is a token of the theme in use, never a raw pixel: Paper scales its tokens
// (`moderateScale`) and the hosts keep that scaling, on the web too. A pane 360 wide next to a
// Paper component 1.16× its MD3 size would look shrunken; derived from the tokens, the panes scale
// with the components they hold. With an identity scale the values are MD3's exactly (80, 24, 360…).

/** The MD3 spacing unit, in dp: `theme.spacing.x1` is this, scaled. */
const MD3_SPACING_UNIT = 4;

/**
 * How much the theme scales MD3's dp (`theme.spacing.x1 / 4`): 1 when the host renders dp 1:1.
 * Paper's `moderateScale` is linear, so every token carries the same factor.
 *
 * @param {object} theme a Paper theme
 * @returns {number}
 */
export const tokenScale = (theme) => theme.spacing.x1 / MD3_SPACING_UNIT;

/**
 * The pane geometry of a theme:
 * - `rail` 80 (`x20`), `margin` and `spacer` 24 (`x6`), `fixedPane` 360 (`x20 × 4.5`);
 * - `paneRadius` 16 (MD3 shape «large», `roundness × 4`);
 * - `sideSheetWidth` 360 and `sideSheetRadius` 16;
 * - `bottomSheetMaxWidth` 640 (`x20 × 8`), `bottomSheetRadius` 28 (MD3 «extra large», `roundness × 7`);
 * - `dragHandle` 32 × 4 (`x8` × `x1`).
 *
 * @param {object} theme a Paper theme
 */
export const paneMetrics = (theme) => {
    const { spacing, roundness } = theme;
    const fixedPane = spacing.x20 * 4.5;
    const paneRadius = roundness * 4;
    return Object.freeze({
        rail: spacing.x20,
        margin: spacing.x6,
        spacer: spacing.x6,
        fixedPane,
        paneRadius,
        sideSheetWidth: fixedPane,
        sideSheetRadius: paneRadius,
        bottomSheetMaxWidth: spacing.x20 * 8,
        bottomSheetRadius: roundness * 7,
        dragHandle: Object.freeze({ width: spacing.x8, height: spacing.x1 }),
    });
};

/** `paneMetrics` of the theme in use. */
export const usePaneMetrics = () => paneMetrics(useTheme());

/** A modal bottom sheet never covers more than this share of the window's height. */
export const BOTTOM_SHEET_MAX_HEIGHT = 0.85;

/** MD3 window size classes. */
export const SIZE_CLASS = Object.freeze({
    COMPACT: 'compact',
    MEDIUM: 'medium',
    EXPANDED: 'expanded',
    LARGE: 'large',
    EXTRA_LARGE: 'extraLarge',
});

/** The lower bound (inclusive, MD3 dp) of each class, widest first. */
export const SIZE_CLASS_BREAKPOINTS = Object.freeze([
    Object.freeze([1600, SIZE_CLASS.EXTRA_LARGE]),
    Object.freeze([1200, SIZE_CLASS.LARGE]),
    Object.freeze([840, SIZE_CLASS.EXPANDED]),
    Object.freeze([600, SIZE_CLASS.MEDIUM]),
]);

/**
 * The size class of a width in MD3 dp: compact `<600`, medium `600–839`, expanded `840–1199`,
 * large `1200–1599`, extraLarge `>=1600`.
 *
 * @param {number} width
 * @returns {string} a SIZE_CLASS
 */
export const sizeClassOf = (width) => SIZE_CLASS_BREAKPOINTS.find(([min]) => width >= min)?.[1] ?? SIZE_CLASS.COMPACT;

/** The three layouts a screen may declare. */
export const LAYOUT = Object.freeze({
    /** list 360 · detail flex · supporting 360 */
    L3: 'L3',
    /** list 360 · detail flex */
    L2A: 'L2A',
    /** primary flex · supporting 360 */
    L2B: 'L2B',
});

/** The panes of a layout. */
export const PANE = Object.freeze({
    LIST: 'list',
    DETAIL: 'detail',
    PRIMARY: 'primary',
    SUPPORTING: 'supporting',
});

/** Where the supporting pane goes when it does not fit. */
export const SUPPORTING_MODE = Object.freeze({
    NONE: 'none',
    INLINE: 'inline',
    SIDE_SHEET: 'sideSheet',
    BOTTOM_SHEET: 'bottomSheet',
});
