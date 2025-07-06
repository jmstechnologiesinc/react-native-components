import React from 'react';

import { List as JMSList, imageKitAvatar } from '@jmstechnologiesinc/react-native-components';

import { Avatar } from '@jmstechnologiesinc/react-native-paper';

import { interpunct } from '@jmstechnologiesinc/commons';

const OrderDriverAvatar = ({ photo, formattedDriverName, formattedTripStatus, formattedVehicleValue, chips = [] }) => {
    const description = [];
    if (formattedVehicleValue) {
        description.push(formattedVehicleValue);
    }

    if (formattedTripStatus) {
        description.push(formattedTripStatus);
    }

    return (
        <JMSList.Item
            title={formattedDriverName}
            description={description.length > 0 ? description : null}
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            chips={chips}
            left={
                photo
                    ? (props) => <Avatar.Image source={{ uri: imageKitAvatar(photo) }} style={props.style} />
                    : (props) => <Avatar.Icon icon="car" style={props.style} />
            }
        />
    );
};

export default OrderDriverAvatar;
