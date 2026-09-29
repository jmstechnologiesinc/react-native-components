import { LAYOUT, PANE, SIZE_CLASS, SUPPORTING_MODE } from './metrics';

/**
 * @typedef {object} PaneArrangement
 * @property {string[]} panes the panes laid out side by side, leading to trailing
 * @property {boolean} single one pane at a time (list ⇄ detail, with a back arrow)
 * @property {string} supporting a SUPPORTING_MODE
 */

const WIDE = new Set([SIZE_CLASS.EXPANDED, SIZE_CLASS.LARGE, SIZE_CLASS.EXTRA_LARGE]);

/**
 * The MD3 collapse table, as data. Compact windows (<600) collapse like medium ones.
 *
 * | Layout | XL | Large / Expanded | Medium / Compact |
 * |---|---|---|---|
 * | L3  | list · detail · supporting | list · detail, supporting → SideSheet | list ⇄ detail, supporting → SideSheet |
 * | L2A | list · detail | list · detail | list ⇄ detail |
 * | L2B | primary · supporting | primary · supporting | primary, supporting → BottomSheet |
 * | L1  | primary | primary | primary |
 *
 * @param {string} layout a LAYOUT
 * @param {string} sizeClass a SIZE_CLASS
 * @param {string} [activePane] the pane shown when only one fits (list | detail); list by default
 * @returns {PaneArrangement}
 */
export const paneArrangement = (layout, sizeClass, activePane = PANE.LIST) => {
    const wide = WIDE.has(sizeClass);
    const single = [activePane === PANE.DETAIL ? PANE.DETAIL : PANE.LIST];

    switch (layout) {
        case LAYOUT.L3:
            if (sizeClass === SIZE_CLASS.EXTRA_LARGE) {
                return {
                    panes: [PANE.LIST, PANE.DETAIL, PANE.SUPPORTING],
                    single: false,
                    supporting: SUPPORTING_MODE.INLINE,
                };
            }
            return wide
                ? { panes: [PANE.LIST, PANE.DETAIL], single: false, supporting: SUPPORTING_MODE.SIDE_SHEET }
                : { panes: single, single: true, supporting: SUPPORTING_MODE.SIDE_SHEET };
        case LAYOUT.L2A:
            return wide
                ? { panes: [PANE.LIST, PANE.DETAIL], single: false, supporting: SUPPORTING_MODE.NONE }
                : { panes: single, single: true, supporting: SUPPORTING_MODE.NONE };
        case LAYOUT.L1:
            return { panes: [PANE.PRIMARY], single: false, supporting: SUPPORTING_MODE.NONE };
        case LAYOUT.L2B:
            return wide
                ? { panes: [PANE.PRIMARY, PANE.SUPPORTING], single: false, supporting: SUPPORTING_MODE.INLINE }
                : { panes: [PANE.PRIMARY], single: false, supporting: SUPPORTING_MODE.BOTTOM_SHEET };
        default:
            throw new Error(`Unknown pane layout ${layout}`);
    }
};

const FIXED_WIDTH_PANES = new Set([PANE.LIST, PANE.SUPPORTING]);

/** The classes a wide arrangement falls back through, widest first (compact collapses like medium). */
const FALLBACK_CLASSES = Object.freeze([
    SIZE_CLASS.EXTRA_LARGE,
    SIZE_CLASS.LARGE,
    SIZE_CLASS.EXPANDED,
    SIZE_CLASS.MEDIUM,
]);

/**
 * Whether an arrangement fits `width` (the layout's own width, its padding included): every flexible pane at
 * least as wide as a fixed one (MD3: the flexible pane is the wider one). One pane always fits.
 *
 * @param {PaneArrangement} arrangement
 * @param {number} width
 * @param {ReturnType<import('./metrics').paneMetrics>} metrics
 * @returns {boolean}
 */
export const fitsWidth = (arrangement, width, metrics) => {
    const { panes } = arrangement;
    if (arrangement.single || panes.length < 2) return true;
    const fixed = panes.filter((pane) => FIXED_WIDTH_PANES.has(pane)).length;
    const flexible = panes.length - fixed;
    if (!flexible) return true;
    const room = width - 2 * metrics.margin - (panes.length - 1) * metrics.spacer - fixed * metrics.fixedPane;
    return room / flexible >= metrics.fixedPane;
};

/**
 * The arrangement of `sizeClass` if it fits `width`, else that of the next narrower class that does. The window's
 * class alone is not enough: a host's own chrome (the navigation rail) sits beside the layout, and the theme's
 * token scale widens the fixed panes, so at 840px two panes could leave the flexible one narrower than the list.
 *
 * @param {string} layout a LAYOUT
 * @param {string} sizeClass the window's SIZE_CLASS
 * @param {string} [activePane]
 * @param {number} width the layout's own width
 * @param {ReturnType<import('./metrics').paneMetrics>} metrics
 * @returns {PaneArrangement}
 */
export const fittingArrangement = (layout, sizeClass, activePane, width, metrics) => {
    const start = FALLBACK_CLASSES.indexOf(sizeClass);
    if (start < 0) return paneArrangement(layout, sizeClass, activePane);
    const candidates = FALLBACK_CLASSES.slice(start);
    const fitting = candidates
        .map((candidate) => paneArrangement(layout, candidate, activePane))
        .find((arrangement) => fitsWidth(arrangement, width, metrics));
    return fitting ?? paneArrangement(layout, SIZE_CLASS.MEDIUM, activePane);
};

export default paneArrangement;
