// ADR-0017 §5.4 and §7 rebanada 2 — the view model, and the ONE rule that
// governs it: when the narration has nothing to say, this package says
// nothing. It does not fall back to `whatIsTheOrderStatus`.
//
// That is the design constraint of the slice, not a detail. 32 of the 165
// cells are PENDING — the assignment axis and the custody — because ADR-0017's
// amendment fixes a capability's semantics only after its C5, and a fallback
// would keep the legacy vocabulary alive indefinitely: exactly the patch C6
// exists to end. The honest degradation is the canonical LABEL, which the
// catalogue carries complete for all eleven members.
jest.mock('react-native-localize', () => ({
    findBestLanguageTag: jest.fn(() => ({ languageTag: 'en', isRTL: false })),
}));

import { CANONICAL_ORDER_STATUS as C, ORDER_STATUS } from '@jmstechnologiesinc/order';
import { INTENTS, TONES, MATRIX, CELL_STATE } from '@jmstechnologiesinc/order-narration';

import { setI18nConfig } from '../../Localization/Localization';
import { orderViewModel, statusLabel } from '../viewModel';

beforeAll(() => {
    setI18nConfig();
});

const marketplaceOrder = (status, extra = {}) => ({
    id: 'order-1',
    status,
    platform: 'shopping',
    fulfillmentMethod: 'delivery',
    vendor: { title: 'Casa Nostra', deliveryMethod: 'Marketplace' },
    author: { firstName: 'Marcos' },
    cart: { quantity: 3 },
    customerCost: [{ id: 'total', amount: 2775 }],
    ...extra,
});

describe('statusLabel — the label family is complete for the eleven members', () => {
    it.each(Object.values(C))('%s has a label', (status) => {
        const label = statusLabel(status);
        expect(label).toBeTruthy();
        expect(label).not.toBe(`order.status.${status}`);
    });

    it('accepts a legacy value at the gate and answers the canonical label', () => {
        expect(statusLabel(ORDER_STATUS.vendorAccepted)).toBe(statusLabel(C.confirmed));
        expect(statusLabel(ORDER_STATUS.driverPending)).toBe(statusLabel(C.awaitingDriver));
    });

    it('answers null for something that is not a status at all', () => {
        expect(statusLabel('Completado')).toBeNull();
        expect(statusLabel(undefined)).toBeNull();
    });
});

describe('orderViewModel — a capability whose C5 closed produces a sentence', () => {
    it('narrates `placed` to the customer with the vendor named', () => {
        const model = orderViewModel({ order: marketplaceOrder(C.placed), actor: 'customer' });

        expect(model.narrated).toBe(true);
        expect(model.stage).toBe(C.placed);
        expect(model.headline).toContain('Casa Nostra');
        expect(model.detail).toBeTruthy();
        expect(model.actions.map((action) => action.intent)).toEqual([INTENTS.customerCancel]);
        expect(model.chips.map((chip) => chip.formattedValue)).toEqual([statusLabel(C.placed)]);
    });

    it('gives the vendor its own sentence and its own buttons for the same status', () => {
        const model = orderViewModel({ order: marketplaceOrder(C.placed), actor: 'vendor' });

        expect(model.headline).toContain('Marcos');
        expect(model.actions.map((action) => action.intent)).toEqual([
            INTENTS.vendorAccept,
            INTENTS.vendorReject,
            INTENTS.uiPrint,
            INTENTS.uiCall,
        ]);
    });

    it('carries the tone and the icon the buttons need, so no component parses a value', () => {
        const model = orderViewModel({ order: marketplaceOrder(C.placed), actor: 'vendor' });
        const byIntent = Object.fromEntries(model.actions.map((action) => [action.intent, action]));

        expect(byIntent[INTENTS.vendorAccept].tone).toBe(TONES.primary);
        expect(byIntent[INTENTS.vendorReject].tone).toBe(TONES.destructive);
        expect(byIntent[INTENTS.vendorReject].confirm).toBe(true);
        expect(byIntent[INTENTS.uiPrint].icon).toBeTruthy();
        expect(byIntent[INTENTS.vendorAccept].icon).toBeNull();
    });

    it('takes the legacy spelling at the gate — `canonicalOf` runs there and only there', () => {
        const canonical = orderViewModel({ order: marketplaceOrder(C.placed), actor: 'customer' });
        const legacy = orderViewModel({ order: marketplaceOrder(ORDER_STATUS.placed), actor: 'customer' });

        expect(legacy.headline).toBe(canonical.headline);
        expect(legacy.stage).toBe(C.placed);
    });

    it('chooses the variant from the facts, not from a second status', () => {
        const promised = orderViewModel({
            order: marketplaceOrder(C.confirmed, { preparation: { promisedReadyAt: '2026-09-13T18:42:00.000Z' } }),
            actor: 'customer',
        });
        const unpromised = orderViewModel({ order: marketplaceOrder(C.confirmed), actor: 'customer' });

        expect(promised.semanticVariant).toBeNull();
        expect(unpromised.semanticVariant).toBe('no_promise');
        expect(unpromised.headline).not.toContain('%{');
        expect(promised.detail).not.toBe(unpromised.detail);
    });

    it('never leaves a placeholder unrendered in either language', () => {
        for (const actor of ['customer', 'vendor']) {
            const model = orderViewModel({ order: marketplaceOrder(C.placed), actor });
            expect(model.headline).not.toMatch(/%\{/);
            expect(model.detail ?? '').not.toMatch(/%\{/);
        }
    });
});

describe('orderViewModel — a capability whose C5 has NOT closed stays silent', () => {
    // The custody: pending until its C5 (plan §20.8; D-9 decided, the cut
    // live, its E-3 waiting). If this test ever fails because a sentence
    // appeared, the matrix grew a row before its capability crossed — which is
    // the thing ADR-0017's amendment forbids. The assignment axis left this
    // list when its C5 closed (M92) and its 24 cells were written (M93,
    // order-narration 0.0.1): it is asserted FINAL below for the same reason.
    const pending = [C.inTransit];

    it.each([C.awaitingDriver, C.driverAssigned, C.driverEnroute])(
        '%s: final since M92/M93 — a sentence, from the matrix',
        (status) => {
            expect(MATRIX.DM[status].customer.state).toBe(CELL_STATE.final);
            const model = orderViewModel({ order: marketplaceOrder(status), actor: 'customer' });
            expect(model.narrated).toBe(true);
            expect(typeof model.headline).toBe('string');
        }
    );

    it.each(pending)('%s: no sentence, no actions', (status) => {
        const model = orderViewModel({ order: marketplaceOrder(status), actor: 'customer' });

        expect(MATRIX.DM[status].customer.state).toBe(CELL_STATE.pending);
        expect(model.narrated).toBe(false);
        expect(model.headline).toBeNull();
        expect(model.detail).toBeNull();
        expect(model.actions).toEqual([]);
    });

    it.each(pending)('%s: the LABEL still exists — a chip is always painted', (status) => {
        const model = orderViewModel({ order: marketplaceOrder(status), actor: 'customer' });

        expect(model.stage).toBe(status);
        expect(model.statusLabel).toBe(statusLabel(status));
        expect(model.statusLabel).toBeTruthy();
        expect(model.chips).toHaveLength(1);
    });

    it('an order whose vertical cannot be resolved says nothing rather than guessing', () => {
        const model = orderViewModel({
            order: { id: 'x', status: C.placed, fulfillmentMethod: 'delivery', vendor: {} },
            actor: 'customer',
        });

        expect(model.narrated).toBe(false);
        expect(model.statusLabel).toBe(statusLabel(C.placed));
    });
});
