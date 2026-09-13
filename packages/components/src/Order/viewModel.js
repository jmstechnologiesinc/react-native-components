import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { CANONICAL_ORDER_STATUS, canonicalOf } from '@jmstechnologiesinc/order';
import {
    INTENTS,
    TONES,
    describeOrder,
    narrativeInputFrom,
} from '@jmstechnologiesinc/order-narration';

import { localized } from '../Localization/Localization';

// ADR-0017 §5.4 and §7 rebanada 2 — THE ONE PLACE KEYS BECOME TEXT.
//
// `order-narration` answers with keys and parameters and never with a phrase,
// because a package that returned text would have decided the locale, the
// fallback chain and the formatting — three things it cannot see. This module
// is where this package, which CAN see all three, does the deciding. Below it,
// the components take strings and paint them; above it, the screens pass an
// order and an actor. Nothing in between reads a status.
//
// WHY THERE IS NO FALLBACK TO `whatIsTheOrderStatus` HERE, and this is the
// design constraint of the whole slice: of the 165 cells, 32 are PENDING —
// the assignment axis and the custody, whose C5 has not closed (plan §20.8;
// custody additionally waits on D-9). For those `describeOrder` returns `null`
// ON PURPOSE. ADR-0017's amendment fixes the semantics of a capability only
// after its C5, so an invented sentence for a state nobody adjudicated is
// precisely the defect this package exists to remove — and a fallback to the
// old table would keep the legacy vocabulary alive indefinitely, which is the
// patch C6 exists to avoid.
//
// The honest degradation is the one the catalogue already carries: the
// `order.status.<canonical>` family is COMPLETE for all eleven members. So a
// pending cell still yields a LABEL — the chip, the list header, the badge —
// and simply no SENTENCE. A chip is always painted; a sentence appears when
// there is something to say.

/** The short label of a canonical status. Complete for the eleven members of
 *  canon §10, independent of whether that capability's cell is final. */
export const statusLabel = (status) => {
    const canonical = canonicalOf(status);
    return canonical ? localized(`order.status.${canonical}`) : null;
};

// Only the two device intents carry an icon; a domain intent is named by its
// words. `ui.print` keeps the printer the vendor already knows.
const INTENT_ICON = {
    [INTENTS.uiPrint]: MATERIAL_ICONS.printer,
    [INTENTS.uiCall]: MATERIAL_ICONS.call,
};

const chipFrom = (status) => ({
    formattedValue: statusLabel(status),
    value: status,
    type: null,
});

const actionFrom = (action) => ({
    intent: action.intent,
    title: localized(action.labelKey),
    tone: action.tone,
    icon: INTENT_ICON[action.intent] || null,
    confirm: action.confirm,
});

/* A NarrativeDescriptor -> the localized view model the components paint.
 * Exported on its own so a caller that already holds a descriptor (a story, a
 * test, a screen that called `describeOrder` itself) does not have to rebuild
 * the input. */
export const fromDescriptor = (descriptor, status) => {
    if (!descriptor) {
        // No cell, or a cell that is N/A or PENDING. The label survives; the
        // sentence does not exist yet. See the note at the top of the file.
        const canonical = canonicalOf(status);
        return {
            stage: canonical,
            headline: null,
            detail: null,
            severity: null,
            statusLabel: statusLabel(status),
            chips: canonical ? [chipFrom(canonical)] : [],
            actions: [],
            eta: null,
            progress: null,
            semanticVariant: null,
            narrated: false,
        };
    }

    return {
        stage: descriptor.stage,
        headline: localized(descriptor.headlineKey, descriptor.params),
        detail: descriptor.detailKey ? localized(descriptor.detailKey, descriptor.params) : null,
        severity: descriptor.severity,
        statusLabel: statusLabel(descriptor.stage),
        chips: descriptor.chips.map(chipFrom),
        actions: descriptor.intents.map(actionFrom),
        eta: descriptor.eta,
        progress: descriptor.progress,
        semanticVariant: descriptor.semanticVariant,
        narrated: true,
    };
};

/**
 * An order document and an actor -> the localized view model.
 *
 * `actor` is the narration's word (`customer` / `vendor` / `driver`), which is
 * also what `USER_ROLES` spells, so a screen passes `currentUser.role`
 * unchanged. `facts` carries what the document does not hold — today only the
 * driver's local arrival state, which canon §9.1 says does not project.
 */
export const orderViewModel = ({ order, actor, facts = {} } = {}) => {
    const input = narrativeInputFrom({ order, actor, extraFacts: facts });
    return fromDescriptor(input ? describeOrder(input) : null, order?.status);
};

export { CANONICAL_ORDER_STATUS, INTENTS, TONES };
