import React from 'react';

import { Avatar, List } from '@jmstechnologiesinc/react-native-paper';

import { ITEM_TYPE, ITEM_TYPE_ICON_MAPPING, MATERIAL_ICONS} from '@jmstechnologiesinc/commons';
import { localized, makeLinkingCall,imageKitAvatar } from '@jmstechnologiesinc/react-native-components';

const OrderDriverProfileListItem = ({
    durationRemainingFormatted,

    partnership,
    name,
    vehicle,
    phoneNumber,
    formattedTripStatus,
    photo,

    showEta = true,
    showStatus = true,
    showPhoneNumber = true,
    isDriverPartnerShipVisible = true,
}) => (
    <>
        {name ? (
            <List.Item
                title={name}
                description={vehicle}
                titleNumberOfLines={0}
                left={photo ? (props) => <Avatar.Image style={props.style} source={{ uri: imageKitAvatar(photo) }} /> : null} />
        ) : null}

        {showEta && durationRemainingFormatted ? (
            <List.Item
                title={durationRemainingFormatted}
                description={localized("estimateTimeOfArrival")}
                titleNumberOfLines={0}
                left={(props) => <List.Icon {...props} icon={"car-clock"} />} />
        ) : null}

        {showStatus && formattedTripStatus ? (
            <List.Item
                title={formattedTripStatus}
                titleNumberOfLines={0}
                left={(props) => <List.Icon {...props} icon='message-text-clock-outline' />} />
        ) : null}

        {isDriverPartnerShipVisible && partnership ? (
            <List.Item
                title={partnership}
                description={localized("driverPartnership")}
                left={(props) => <List.Icon {...props} icon={MATERIAL_ICONS.fulfillmentMethod} />} />
        ) : null}

        {showPhoneNumber && phoneNumber ? (
            <List.Item
                title={phoneNumber}
                left={(props) => <List.Icon {...props} icon={ITEM_TYPE_ICON_MAPPING[ITEM_TYPE.call]} />}
                onPress={() => makeLinkingCall(phoneNumber)} />
        ) : null}
    </>
);

export default OrderDriverProfileListItem;
