import React from 'react';

import { MD3Colors } from '@jmstechnologiesinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { ORDER_ACTIONS, ORDER_STATUS_CANCELLED } from '@jmstechnologiesinc/order';
import { TONES } from '@jmstechnologiesinc/order-narration';
import { ActionGroup, ScreenWrapper } from '@jmstechnologiesinc/react-native-components';

// ADR-0017 §5.4 — the buttons stop reading the status.
//
// WHAT THIS COMPONENT USED TO DO, and why it was the clearest symptom of the
// whole diagnosis: it inferred a button's appearance from the VALUE the button
// would write. `ORDER_STATUS_CANCELLED(button.value)` asked the domain whether
// a string was a cancellation in order to decide a colour, and the print
// button was recognised by `button.value === ORDER_ACTIONS.print` — a constant
// from a different package that happens to collide, on the literal `'print'`,
// with `ITEM_TYPE.print`, which is what the table actually put there
// (§2.2). Appearance was a function of a status, so a status the table did not
// name produced a button with no shape, and a renamed status silently
// restyled the screen.
//
// Now the narration declares a TONE and this component decides what a tone
// looks like here. `order-narration` ships no colour on purpose — it cannot
// see the theme — so this table is the other half of that contract, and it is
// the only place in the slice where MD3 tokens meet the narration.
const styleForTone = (tone) => {
    switch (tone) {
        case TONES.destructive:
            return { mode: 'text', compact: true, textColor: MD3Colors.error50, contentStyle: { flexGrow: 2 } };
        case TONES.neutral:
            return { mode: 'text', compact: true, contentStyle: { flexGrow: 2 } };
        default:
            return { compact: false, contentStyle: { flexGrow: 3 } };
    }
};

/* DEPRECATED, and it lives exactly one release (D-51).
 *
 * The old `buttons` shape — `[{ title, value }]`, where `value` is a status or
 * an `ITEM_TYPE` — is still what `whatIsTheOrderStatus` produces, and the app
 * still calls it until N2c. Until then this keeps the old inference, unchanged
 * and quarantined, so the behaviour of a consumer that has not migrated does
 * not change at all. It goes with `whatIsTheOrderStatus` at C6. */
const fromLegacyButton = (button) => {
    if (ORDER_STATUS_CANCELLED(button.value)) {
        return { ...button, mode: 'text', compact: true, textColor: MD3Colors.error50, contentStyle: { flexGrow: 2 } };
    }
    if (button.value === ORDER_ACTIONS.print) {
        return { ...button, icon: MATERIAL_ICONS.printer, mode: 'text', contentStyle: { flexGrow: 2 } };
    }
    return { ...button, compact: false, contentStyle: { flexGrow: 3 } };
};

const fromAction = (action) => ({
    ...action,
    // `value` is what `onPress` has always carried to the caller. It is the
    // INTENT now, not a status: nothing downstream can write it by accident.
    value: action.intent,
    icon: action.icon || undefined,
    ...styleForTone(action.tone),
});

const OrderTransitionButtons = ({ actions, buttons = [], onPress }) => {
    const rendered = actions ? actions.map(fromAction) : buttons?.map(fromLegacyButton);

    return rendered?.length > 0 ? (
        <ScreenWrapper.Container>
            <ScreenWrapper.Section>
                <ActionGroup.Group>
                    <ActionGroup.Buttons buttons={rendered} onPress={(button) => onPress(button)} />
                </ActionGroup.Group>
            </ScreenWrapper.Section>
        </ScreenWrapper.Container>
    ) : null;
};

export default OrderTransitionButtons;
