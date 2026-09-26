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
        case LAYOUT.L2B:
            return wide
                ? { panes: [PANE.PRIMARY, PANE.SUPPORTING], single: false, supporting: SUPPORTING_MODE.INLINE }
                : { panes: [PANE.PRIMARY], single: false, supporting: SUPPORTING_MODE.BOTTOM_SHEET };
        default:
            throw new Error(`Unknown pane layout ${layout}`);
    }
};

export default paneArrangement;
