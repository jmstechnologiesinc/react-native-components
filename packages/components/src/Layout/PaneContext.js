import { createContext, useContext } from 'react';

/**
 * @typedef {object} PaneContextValue
 * @property {?string} role the PANE this subtree renders (null outside a PaneLayout)
 * @property {boolean} inSheet the pane is shown inside a SideSheet/BottomSheet
 * @property {?(() => void)} onBack back to the list (single-pane windows, detail pane only)
 * @property {?(() => void)} onShowSupporting opens the collapsed supporting pane (detail/primary pane only)
 * @property {?(() => void)} onCloseSheet closes the sheet this pane lives in
 * @property {?string} supportingMode a SUPPORTING_MODE
 */

/** @type {PaneContextValue} */
export const NO_PANE = Object.freeze({
    role: null,
    inSheet: false,
    onBack: null,
    onShowSupporting: null,
    onCloseSheet: null,
    supportingMode: null,
});

export const PaneContext = createContext(NO_PANE);

/** What the enclosing PaneLayout expects of this pane (PaneHeader reads it to add back/toggle/close). */
export const usePaneContext = () => useContext(PaneContext);
