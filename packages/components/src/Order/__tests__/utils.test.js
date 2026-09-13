// ADR-0017 §5.4 and §7 rebanada 2 — the order list, and the two defects the
// old `utils.js` could not be asked about.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import { USER_ROLES } from '@jmstechnologiesinc/user';
import { CANONICAL_ORDER_STATUS as C, ORDER_STATUS, orderStatusTime } from '@jmstechnologiesinc/order';
import { PROGRESS_RAIL, TERMINAL_STATES } from '@jmstechnologiesinc/order-narration';

import { setI18nConfig, localized } from '../../Localization/Localization';
import { statusLabel } from '../viewModel';
import { ORDER_TIME_FIELDS } from '../documentFields';
import {
    ORDER_LIST_STATUS,
    ORDER_LIST_GROUPS,
    ORDER_LIST_BUCKETS,
    ORDER_LIST_FILTERS,
    ROLE_ORDER_LIST_STATUS_SORT,
    orderListStatus,
    orderListSectionTitle,
    groupedOrderListToSectionList,
} from '../utils';

beforeAll(() => {
    setI18nConfig();
});

const ROLES = [USER_ROLES.customer, USER_ROLES.vendor, USER_ROLES.driver];

describe('no `localized` at import time (§2.1 defect: «evaluado al importar el módulo»)', () => {
    it('every exported bucket value is a canonical status or a declared group, never a phrase', () => {
        const groups = Object.values(ORDER_LIST_GROUPS);
        const canonical = Object.values(C);

        for (const value of Object.values(ORDER_LIST_STATUS)) {
            expect(canonical.includes(value) || groups.includes(value)).toBe(true);
        }
    });

    it('a group value can never collide with a canonical member of canon §10', () => {
        for (const group of Object.values(ORDER_LIST_GROUPS)) {
            expect(Object.values(C)).not.toContain(group);
        }
    });

    it('a section title is resolved when the section is built, so it is real text', () => {
        const title = orderListSectionTitle(C.placed, USER_ROLES.customer);
        expect(title).toBe(statusLabel(C.placed));
        expect(title).not.toBe(`order.status.${C.placed}`);
    });
});

describe('the buckets come from the matrix (§2.1 defect: a hand list nobody could check)', () => {
    it('holds every canonical status a shopping rail can reach, plus the four terminals', () => {
        for (const status of [...PROGRESS_RAIL.DM, ...PROGRESS_RAIL.PU, ...TERMINAL_STATES]) {
            expect(ORDER_LIST_BUCKETS).toContain(status);
        }
    });

    it.each(ROLES)('%s: every bucket in the sort order is one `orderListStatus` can return', (role) => {
        const reachable = new Set(
            [...Object.values(C), ORDER_LIST_GROUPS.preparing].map((status) =>
                Object.values(C).includes(status) ? orderListStatus(status, role) : status
            )
        );

        for (const bucket of ROLE_ORDER_LIST_STATUS_SORT[role]) {
            expect(reachable.has(bucket)).toBe(true);
        }
    });

    it.each(ROLES)('%s: every status this role can see lands in a bucket the sort order lists', (role) => {
        for (const status of Object.values(C)) {
            const bucket = orderListStatus(status, role);
            // `ready_for_pickup` is N/A for a driver and `placed` reaches no
            // driver until the merchant accepts, so a driver never sees them.
            if (role === USER_ROLES.driver && [C.readyForPickup, C.placed, C.confirmed].includes(status)) continue;
            expect(ROLE_ORDER_LIST_STATUS_SORT[role]).toContain(bucket);
        }
    });

    // The dead row the old table carried: `ORDER_LIST_STATUS.cancelled` was in
    // all three sort orders and `orderListStatus` never returned it, because a
    // cancellation collapses into `completed`. An empty section forever.
    it('the four terminals collapse into one bucket, for every role', () => {
        for (const role of ROLES) {
            for (const terminal of TERMINAL_STATES) {
                expect(orderListStatus(terminal, role)).toBe(C.completed);
            }
        }
    });
});

describe('orderListStatus — canonical in, canonical out, legacy normalized at the gate', () => {
    it('groups the customer\'s whole preparation span into one bucket', () => {
        for (const status of [C.confirmed, C.awaitingDriver, C.driverAssigned, C.driverEnroute]) {
            expect(orderListStatus(status, USER_ROLES.customer)).toBe(ORDER_LIST_GROUPS.preparing);
        }
    });

    it('does NOT group them for the driver, who acts on each one', () => {
        expect(orderListStatus(C.awaitingDriver, USER_ROLES.driver)).toBe(C.awaitingDriver);
        expect(orderListStatus(C.driverAssigned, USER_ROLES.driver)).toBe(C.driverAssigned);
        expect(orderListStatus(C.driverEnroute, USER_ROLES.driver)).toBe(C.driverEnroute);
    });

    it('answers the same for a legacy value and its canonical member', () => {
        for (const role of ROLES) {
            expect(orderListStatus(ORDER_STATUS.vendorAccepted, role)).toBe(orderListStatus(C.confirmed, role));
            expect(orderListStatus(ORDER_STATUS.shipped, role)).toBe(orderListStatus(C.driverEnroute, role));
            expect(orderListStatus(ORDER_STATUS.customerCancelled, role)).toBe(orderListStatus(C.cancelled, role));
            // `Driver Rejected` is absorbed into `awaiting_driver` (canon §15)
            // and still reaches this table from the app's `rejectByDriver`.
            expect(orderListStatus(ORDER_STATUS.driverRejected, role)).toBe(orderListStatus(C.awaitingDriver, role));
        }
    });
});

describe('groupedOrderListToSectionList — titles at call time, in the role\'s order', () => {
    const grouped = {
        [C.placed]: [{ id: 'a' }],
        [ORDER_LIST_GROUPS.preparing]: [{ id: 'b' }],
        [C.completed]: [{ id: 'c' }],
    };

    it('returns nothing without a role', () => {
        expect(groupedOrderListToSectionList(grouped, undefined)).toEqual([]);
    });

    it('keeps the role\'s priority order and skips empty buckets', () => {
        const sections = groupedOrderListToSectionList(grouped, USER_ROLES.vendor);

        expect(sections.map((section) => section.data)).toEqual([[{ id: 'a' }], [{ id: 'b' }], [{ id: 'c' }]]);
        expect(sections.every((section) => typeof section.title === 'string' && section.title.length > 0)).toBe(true);
    });

    it('the vendor calls a placed order «new requests»; the customer uses the canonical label', () => {
        expect(orderListSectionTitle(C.placed, USER_ROLES.vendor)).toBe(localized('order.newRequests'));
        expect(orderListSectionTitle(C.placed, USER_ROLES.customer)).toBe(statusLabel(C.placed));
    });

    it('the history view renames only the completed bucket', () => {
        expect(orderListSectionTitle(C.completed, USER_ROLES.customer, { history: true })).toBe(
            localized('order.history')
        );
        expect(orderListSectionTitle(C.completed, USER_ROLES.customer, { history: false })).toBe(
            statusLabel(C.completed)
        );
    });

    it('exposes the filter names the list screens compare against', () => {
        expect(ORDER_LIST_FILTERS).toEqual({ active: 'active', history: 'history' });
    });
});

// The order document's two timestamp FIELDS keep their legacy-derived names
// (D-12: persisted documents are never rewritten). This pins the spelling
// against the function that used to produce it, so the two cannot drift while
// both exist — and shows why the call had to go: handed a CANONICAL status,
// `orderStatusTime` answers `undefinedTime`.
describe('ORDER_TIME_FIELDS — the data model, not the vocabulary', () => {
    it('spells exactly what `orderStatusTime` spells for the legacy value', () => {
        expect(ORDER_TIME_FIELDS.placed).toBe(orderStatusTime(ORDER_STATUS.placed));
        expect(ORDER_TIME_FIELDS.driverAccepted).toBe(orderStatusTime(ORDER_STATUS.driverAccepted));
    });

    it('and is why the call could not simply be handed a canonical status', () => {
        expect(orderStatusTime(C.placed)).toBe('undefinedTime');
    });
});
