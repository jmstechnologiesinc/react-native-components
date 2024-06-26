import React from 'react';

import { ITEM_TYPE, ITEM_TYPE_ICON_MAPPING, MATERIAL_ICONS, formattedETATime, getMainPhoto, milliseconsExtractor } from '@jmstechnologiesinc/commons';

import usePubNubETA from '../Order/usePubNubETA';
import { Avatar, List } from '@jmstechnologiesinc/react-native-paper';
import { imagekitUrl, localized, makeLinkingCall } from '@jmstechnologiesinc/react-native-components';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { PixelRatio } from 'react-native';
import { imageKitAvatar } from '../utils';

const DriverStatus = ({
    role,
    orderId,
    orderStatus,
    orderDeliveryMethod,
    deliveryMethod,

    name,
    vehicle,
    phoneNumber,
    status,
    avatar,

    showEta = true,
    showStatus = true,
    showPhoneNumber = true,
    showDeliveryMethod=true,
}) => {
    const milliseconds = usePubNubETA({
        role,
        orderId,
        deliveryMethod: orderDeliveryMethod,
        status: orderStatus,
    });

    let eta;
    if (milliseconds) {
        const { hrs, mins } = milliseconsExtractor(milliseconds);
        eta = {
            title: formattedETATime(hrs, mins),
            description: localized("estimateTimeOfArrival"),
            icon: "car-clock",
        };
    }

    const renderAvatar = avatar
        ? (props) => <Avatar.Image style={props.style} source={{ uri: imageKitAvatar(avatar) }} />
        : null;

    return (
        <>      
            {name ? ( 
                <List.Item
                    title={name}
                    description={vehicle}
                    titleNumberOfLines={0}
                    left={renderAvatar}
                />
            ) : null}

            {showEta && eta ? (
                <List.Item
                    title={eta.title}
                    description={eta.description}
                    titleNumberOfLines={0}
                    left={(props) => <List.Icon {...props} icon={eta.icon} />}
                />
            ) : null}
    
            {showStatus && status ? (
                <List.Item
                    title={status}
                    titleNumberOfLines={0}
                    left={(props) => <List.Icon {...props} icon='message-text-clock-outline' />}
                />
            ) : null}
            
            {showDeliveryMethod && deliveryMethod ? (
                <List.Item
                    title={deliveryMethod}
                    description={localized("driverPartnership")}
                    left={(props) => <List.Icon {...props} icon={MATERIAL_ICONS.fulfillmentMethod} />}
                /> 
            ) : null}

            {showPhoneNumber && phoneNumber ? (
                <List.Item
                    title={phoneNumber}
                    left={(props) => <List.Icon {...props} icon={ITEM_TYPE_ICON_MAPPING[ITEM_TYPE.call]} />}
                    onPress={() => makeLinkingCall(phoneNumber)}
                /> 
            ) : null}
        </>
    );
};

export default DriverStatus;
