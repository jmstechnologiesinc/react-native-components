import React from 'react';
import { View } from 'react-native';

import { CANONICAL_ORDER_STATUS as C } from '@jmstechnologiesinc/order';

import { setI18nConfig } from '../Localization/Localization';
import OrderTransitionButtons from './OrderTransitionButtons';
import OrderDriverAvatar from './OrderDriverAvatar';
import OrderOngoingTrip from './OrderOngoingTrip';
import OrderHistoryOrderItem from './OrderHistoryOrderItem';
import { orderViewModel, statusLabel } from './viewModel';

// ADR-0017 §7 rebanada 2 — `Order/` had no stories at all (§2.2), which is
// how a table with ~10 paths returning `undefined` went unseen: nobody could
// look at the vendor's screen for `Vendor Accepted` without running the app
// against a real order in that state.
//
// A story per narrated state is the documentation the plan asks for (§20.7
// N2b), and it doubles as the check that matters here — that a PENDING
// capability renders a label and no sentence, rather than a blank card.
setI18nConfig();

export default {
    title: 'packages/Order',
};

const order = (status, extra = {}) => ({
    id: 'AB12345',
    status,
    platform: 'shopping',
    fulfillmentMethod: 'delivery',
    vendor: { title: 'Casa Nostra', deliveryMethod: 'Marketplace' },
    author: { firstName: 'Marcos' },
    driver: { formattedName: 'Ana Ruiz' },
    cart: { quantity: 3 },
    customerCost: [{ id: 'total', amount: 2775 }],
    ...extra,
});

const Narrated = ({ status, actor, extra }) => {
    const model = orderViewModel({ order: order(status, extra), actor });

    return (
        <View>
            <OrderHistoryOrderItem
                id={order(status).id}
                title={model.headline ?? model.statusLabel}
                statusLabel={model.statusLabel}
                formattedTripStatus={model.detail}
                amount={order(status).customerCost}
                chips={model.chips}
            />
            <OrderTransitionButtons actions={model.actions} onPress={() => {}} />
        </View>
    );
};

// ---------------------------------------------------------------------------
// The seven capabilities whose C5 closed (M85): a sentence, a detail and the
// actor's own buttons, all from one declared cell.
// ---------------------------------------------------------------------------
export const CustomerPlaced = () => <Narrated status={C.placed} actor="customer" />;
export const VendorPlaced = () => <Narrated status={C.placed} actor="vendor" />;
export const CustomerConfirmed = () => (
    <Narrated status={C.confirmed} actor="customer" extra={{ preparation: { promisedReadyAt: '2026-09-13T18:42:00Z' } }} />
);
// The same cell, without the merchant's promise: an auto-confirmed order names
// no time, and the variant says so instead of inventing one.
export const CustomerConfirmedWithoutPromise = () => <Narrated status={C.confirmed} actor="customer" />;
export const VendorReadyForPickup = () => <Narrated status={C.readyForPickup} actor="vendor" />;
export const CustomerCompleted = () => <Narrated status={C.completed} actor="customer" />;

// The cancellation is ONE cell per actor with the sentence as a VARIANT
// (canon §14): the same status tells four stories, and the story comes from
// the record — never from four statuses wearing a new name.
export const CustomerCancelledByThemselves = () => (
    <Narrated status={C.cancelled} actor="customer" extra={{ cancellation: { actor: 'customer', ruling: 'customer_cancelled' } }} />
);
export const CustomerCancelledByTheVendor = () => (
    <Narrated status={C.cancelled} actor="customer" extra={{ cancellation: { actor: 'vendor', ruling: 'vendor_cancelled' } }} />
);

// ---------------------------------------------------------------------------
// A capability whose C5 has NOT closed. This is the honest degradation, and
// the story exists so it is looked at rather than assumed: a LABEL, a chip, no
// sentence and no buttons — never a fallback to the legacy table.
// ---------------------------------------------------------------------------
export const PendingAssignmentAxis = () => <Narrated status={C.driverAssigned} actor="customer" />;

// ---------------------------------------------------------------------------
// The single `chips` contract: both components take chip DATA and render it
// once, at the leaf.
// ---------------------------------------------------------------------------
const chips = [
    { formattedValue: statusLabel(C.inTransit), value: C.inTransit, type: null },
    { formattedValue: 'Marketplace', value: 'Marketplace', type: 'driver' },
];

export const DriverAvatarWithChips = () => (
    <OrderDriverAvatar
        formattedDriverName="Ana Ruiz"
        formattedVehicleValue="Toyota Corolla"
        formattedTripStatus={statusLabel(C.inTransit)}
        chips={chips}
    />
);

export const OngoingTripLoading = () => (
    <OrderOngoingTrip isLoading formattedTripStatus={statusLabel(C.awaitingDriver)} chips={chips} />
);

export const OngoingTripWithDriver = () => (
    <OrderOngoingTrip
        driverPhoto={null}
        formattedDriverName="Ana Ruiz"
        formattedVehicleValue="Toyota Corolla"
        formattedTripStatus={statusLabel(C.driverEnroute)}
        chips={chips}
    />
);

// ---------------------------------------------------------------------------
// The buttons, by tone. Nothing here parses a status to decide a colour.
// ---------------------------------------------------------------------------
export const ButtonsByTone = () => {
    const model = orderViewModel({ order: order(C.placed), actor: 'vendor' });
    return <OrderTransitionButtons actions={model.actions} onPress={() => {}} />;
};
