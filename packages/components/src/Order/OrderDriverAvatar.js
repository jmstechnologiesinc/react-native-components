import React from 'react';

import { List as JMSList, imageKitAvatar } from '@jmstechnologiesinc/react-native-components';

import { Avatar } from '@jmstechnologiesinc/react-native-paper';

// ADR-0017 §5.4 — ONE `chips` CONTRACT, and it is DATA.
//
// The two components disagreed about what `chips` meant: `OrderOngoingTrip`
// mapped its `items` through `JMSList.Chip` and handed DOWN elements, while
// this one passed whatever it received straight to `JMSList.Item`. A caller
// therefore had to know which of the two it was talking to — and the app,
// which does not, passed `items` here and had them silently dropped (§2.3,
// «props que se descartan»). Both now take the same thing, plain chip data,
// and each renders it exactly once at the leaf.
const OrderDriverAvatar = ({
    photo,
    formattedDriverName,
    formattedTripStatus,
    formattedVehicleValue,
    chips = [],
    // DEPRECATED alias, one release (D-51). Today this prop is DISCARDED
    // here, so honouring it fixes a defect rather than preserving one.
    items,
}) => {
    const description = [];
    if (formattedVehicleValue) {
        description.push(formattedVehicleValue);
    }

    if (formattedTripStatus) {
        description.push(formattedTripStatus);
    }

    const renderedChips = (chips.length > 0 ? chips : items || []).map(JMSList.Chip);

    return (
        <JMSList.Item
            title={formattedDriverName}
            description={description.length > 0 ? description : null}
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            chips={renderedChips}
            left={
                photo
                    ? (props) => <Avatar.Image source={{ uri: imageKitAvatar(photo) }} style={props.style} />
                    : (props) => <Avatar.Icon icon="car" style={props.style} />
            }
        />
    );
};

export default OrderDriverAvatar;
