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

import { CANONICAL_ORDER_STATUS as C } from '@jmstechnologiesinc/order';
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

    it('`canonicalOf` runs at the gate and only there — a canonical member is its own stage', () => {
        const canonical = orderViewModel({ order: marketplaceOrder(C.placed), actor: 'customer' });
        expect(canonical.stage).toBe(C.placed);
        expect(canonical.headline).toBeTruthy();
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
    // If this test ever fails because a sentence appeared for a pending
    // capability, the matrix grew a row before its capability crossed — which
    // is the thing ADR-0017's amendment forbids. The assignment axis left the
    // pending list when its C5 closed (M92) and its 24 cells were written
    // (M93, order-narration 0.0.1); the custody left it at M95 (E-3 deliver
    // PASS, order-narration 0.0.2: 93 final, 0 pending). Nothing is pending
    // today; the silent path is still exercised below with a stage the
    // narration cannot name.

    it.each([C.awaitingDriver, C.driverAssigned, C.driverEnroute, C.inTransit])(
        '%s: final since M92/M93/M95 — a sentence, from the matrix',
        (status) => {
            expect(MATRIX.DM[status].customer.state).toBe(CELL_STATE.final);
            const model = orderViewModel({ order: marketplaceOrder(status), actor: 'customer' });
            expect(model.narrated).toBe(true);
            expect(typeof model.headline).toBe('string');
        }
    );

    it('a stage the narration cannot name is silent: no sentence, no actions', () => {
        const model = orderViewModel({ order: marketplaceOrder('Expired'), actor: 'customer' });
        expect(model.narrated).toBe(false);
        expect(model.headline).toBeNull();
        expect(model.actions).toEqual([]);
    });

    it('the LABEL always exists for a canonical member — a chip is always painted', () => {
        const model = orderViewModel({ order: marketplaceOrder(C.inTransit), actor: 'customer' });
        expect(model.stage).toBe(C.inTransit);
        expect(model.statusLabel).toBe(statusLabel(C.inTransit));
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
