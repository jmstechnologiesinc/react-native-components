import { USER_ROLES } from '@jmstechnologiesinc/user';

import { CANONICAL_ORDER_STATUS as C, canonicalOf } from '@jmstechnologiesinc/order';
import { PROGRESS_RAIL, TERMINAL_STATES } from '@jmstechnologiesinc/order-narration';

import { localized } from '../Localization/Localization';
import { statusLabel } from './viewModel';

// ADR-0017 §5.4 and §7 rebanada 2 — the order list, grouped from the matrix.
//
// TWO DEFECTS, and the second is the one that actually bit.
//
// 1. «evaluado al importar el módulo» (§2.1). `ORDER_LIST_STATUS` and the four
//    mapping tables called `localized` at MODULE LOAD. The catalogue is not
//    installed until `setI18nConfig()` runs, so on a cold start every title was
//    the key itself, frozen for the life of the process — and a language change
//    could not reach them, because the table had already been built. The app
//    carries a test that pins precisely this («sin setI18nConfig previo, el
//    mapping cae al key crudo»). Titles are now resolved when a section is
//    built, which is the only moment at which the answer is knowable.
//
// 2. The bucket list was hand-written in legacy strings, so it could silently
//    disagree with reality — and did: `ORDER_LIST_STATUS.cancelled` appears in
//    every role's sort order and `orderListStatus` NEVER RETURNS IT (a
//    cancellation collapses into `completed`, for all three roles). A dead row
//    in a table nobody could check. The buckets are now derived from the
//    narration's `PROGRESS_RAIL` and `TERMINAL_STATES`, so a canonical status
//    that exists but is not placed is a test failure, not an empty section.

// The three groupings that are NOT statuses: a list bucket that gathers
// several, a saved-history view. Prefixed so they can never collide with a
// canonical member of canon §10.
export const ORDER_LIST_GROUPS = Object.freeze({
    preparing: 'group:preparing',
    history: 'group:history',
});

export const ORDER_LIST_FILTERS = Object.freeze({
    active: 'active',
    history: 'history',
});

// The public bucket names, keyed as they have always been keyed — the app
// reads `ORDER_LIST_STATUS.placed` and friends to count its badge — but with
// CANONICAL values, and built without touching the catalogue.
export const ORDER_LIST_STATUS = Object.freeze({
    placed: C.placed,
    confirmed: C.confirmed,
    readyforPickup: C.readyForPickup,
    awaitingDriver: C.awaitingDriver,
    driverAssigned: C.driverAssigned,
    driverEnroute: C.driverEnroute,
    inTransit: C.inTransit,
    completed: C.completed,
    cancelled: C.cancelled,
    vendorRejected: C.vendorRejected,
    noDriverFound: C.noDriverFound,
    preparing: ORDER_LIST_GROUPS.preparing,
    history: ORDER_LIST_GROUPS.history,
});

// Every canonical status a list can hold, from the widest rail plus the four
// terminals. The source of truth for «did we forget one».
export const ORDER_LIST_BUCKETS = Object.freeze([
    ...new Set([...PROGRESS_RAIL.DM, ...PROGRESS_RAIL.DOv, ...PROGRESS_RAIL.PU, ...TERMINAL_STATES]),
]);

// Between the vendor's confirmation and the handover, the customer and the
// vendor see ONE bucket: the order is being prepared and dispatched, and the
// four canonical members of that span are an internal distinction they do not
// act on. The driver does act on them, which is why the driver has no such
// bucket.
const PREPARING = Object.freeze([C.confirmed, C.awaitingDriver, C.driverAssigned, C.driverEnroute]);

/** The list bucket a status belongs to, for this role. Canonical in, canonical
 *  out; a legacy value normalizes at the gate, as every reader does (§20.6). */
export const orderListStatus = (status, role) => {
    const canonical = canonicalOf(status);
    if (!canonical) {
        return status;
    }

    if (TERMINAL_STATES.includes(canonical)) {
        // A dead order is history, whatever killed it. The four terminals of
        // canon §10 collapse into one bucket — which is what the old code did
        // too, by falling through `ORDER_STATUS_CANCELLED` into `completed`.
        return C.completed;
    }

    if (role !== USER_ROLES.driver && PREPARING.includes(canonical)) {
        return ORDER_LIST_GROUPS.preparing;
    }

    return canonical;
};

// The order the sections appear in, per role. It is a PRIORITY order, not the
// lifecycle order — the vendor wants new requests first, the customer wants
// the order that is moving — so it stays declared rather than derived. What is
// no longer possible is for it to disagree with the buckets: the suite checks
// this list against `ORDER_LIST_BUCKETS` and against `orderListStatus`.
const ROLE_ORDER_LIST_STATUS_SORT = Object.freeze({
    [USER_ROLES.vendor]: Object.freeze([
        ORDER_LIST_STATUS.placed,
        ORDER_LIST_GROUPS.preparing,
        ORDER_LIST_STATUS.inTransit,
        ORDER_LIST_STATUS.readyforPickup,
        ORDER_LIST_STATUS.completed,
    ]),
    [USER_ROLES.customer]: Object.freeze([
        ORDER_LIST_STATUS.inTransit,
        ORDER_LIST_STATUS.placed,
        ORDER_LIST_STATUS.readyforPickup,
        ORDER_LIST_GROUPS.preparing,
        ORDER_LIST_STATUS.completed,
    ]),
    [USER_ROLES.driver]: Object.freeze([
        ORDER_LIST_STATUS.awaitingDriver,
        ORDER_LIST_STATUS.inTransit,
        ORDER_LIST_STATUS.driverAssigned,
        ORDER_LIST_STATUS.driverEnroute,
        ORDER_LIST_STATUS.completed,
    ]),
});

// What a role calls a bucket when the default canonical label is not what that
// role means by it. The vendor's `placed` is «new requests»; the driver's
// `awaiting_driver` is the same thing from the other side. Everything absent
// from this table takes `order.status.<canonical>` — one label, one meaning,
// shared with every chip and badge in the product.
const ROLE_SECTION_KEY = Object.freeze({
    [USER_ROLES.vendor]: Object.freeze({ [C.placed]: 'order.newRequests' }),
    [USER_ROLES.driver]: Object.freeze({
        [C.awaitingDriver]: 'order.newRequests',
        [C.driverAssigned]: 'order.pending',
        [C.driverEnroute]: 'order.pickingUpfromVendor',
    }),
    [USER_ROLES.customer]: Object.freeze({}),
});

const GROUP_KEY = Object.freeze({
    [ORDER_LIST_GROUPS.preparing]: 'order.ongoing',
    [ORDER_LIST_GROUPS.history]: 'order.history',
});

/** The localized title of one section. Resolved at call time, never at import. */
export const orderListSectionTitle = (bucket, role, { history = false } = {}) => {
    if (history && bucket === C.completed) {
        return localized('order.history');
    }
    if (GROUP_KEY[bucket]) {
        return localized(GROUP_KEY[bucket]);
    }
    const roleKey = ROLE_SECTION_KEY[role]?.[bucket];
    return roleKey ? localized(roleKey) : statusLabel(bucket);
};

export const groupedOrderListToSectionList = (groupedOrderList, role, { history = true } = {}) => {
    if (!role) {
        return [];
    }

    const sort = ROLE_ORDER_LIST_STATUS_SORT[role] || [];

    return sort
        .filter((bucket) => Object.prototype.hasOwnProperty.call(groupedOrderList, bucket))
        .map((bucket) => ({
            title: orderListSectionTitle(bucket, role, { history }),
            data: groupedOrderList[bucket],
        }));
};

export { ROLE_ORDER_LIST_STATUS_SORT, PREPARING as ORDER_LIST_PREPARING_STATUSES };
