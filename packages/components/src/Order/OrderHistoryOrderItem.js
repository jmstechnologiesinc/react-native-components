import React from 'react';

import { List as JMSList, imageKitAvatar } from '@jmstechnologiesinc/react-native-components';

import { interpunct, findAccountingItem, ACCOUNTING_ITEMS } from '@jmstechnologiesinc/commons';
import { formatOrderID } from '@jmstechnologiesinc/order';
import { Avatar } from '@jmstechnologiesinc/react-native-paper';

import { statusLabel } from './viewModel';

// ADR-0017 §5.4 — «deja de localizar dos veces».
//
// The component took a `status` prop and called `localized(status)` on it, but
// every caller was already passing a localized string — the app's
// `` localized(`order.${order.status}`) ``. So a translated phrase went back
// through the catalogue as if it were a key, found nothing, and survived only
// because `localized` returns its argument when the key is missing. It worked
// by accident, and it stopped working the moment a translation happened to
// match a key.
//
// Now the prop is what it says: `statusLabel` is a LABEL, already localized,
// and the component paints it. `status` stays as a deprecated alias for one
// release (D-51), resolved through the canonical label when it really is a
// status and passed through untouched when it is not — which is exactly what
// the old `localized(status)` did for an already-translated string, and is
// why replacing it changes nothing for a caller that has not migrated.
const labelForLegacyStatus = (value) => {
    if (!value) return null;
    return statusLabel(value) ?? value;
};

const OrderHistoryOrderItem = ({
    id,
    title,
    photo,
    icon = 'car-clock',
    statusLabel: label,
    status,
    platform,
    formattedTripStatus,
    amount,
    chips = [],
    items,
}) => {
    const renderDescription = [
        interpunct([formatOrderID(id), platform, findAccountingItem(amount, ACCOUNTING_ITEMS.total)?.formattedValue]),
        interpunct([label ?? labelForLegacyStatus(status), formattedTripStatus]),
    ];

    const renderLeft = photo
        ? (props) => <Avatar.Image source={{ uri: imageKitAvatar(photo) }} style={props.style} />
        : (props) => <Avatar.Icon icon={icon} style={props.style} />;

    return (
        <JMSList.Item
            title={title}
            description={renderDescription}
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            chips={(chips.length > 0 ? chips : items || []).map(JMSList.Chip)}
            left={renderLeft}
        />
    );
};

export default OrderHistoryOrderItem;
