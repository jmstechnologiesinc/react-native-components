import React from 'react';

import { ITEM_TYPE, ITEM_TYPE_ICON_MAPPING, formattedETATime, milliseconsExtractor } from '@jmstechnologiesinc/commons';

import usePubNubETA from '../Order/usePubNubETA';
import { Avatar, Divider, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { imagekitUrl, makeLinkingCall } from '@jmstechnologiesinc/react-native-components/lib/utils';

const DriverStatus = ({
    role,
    orderID,
    orderStatus,
    orderDeliveryMethod,

    name,
    vehicle,
    phone,
    status,
    avatar,
}) => {
    const milliseconds = usePubNubETA({
        role,
        orderID,
        deliveryMethod: orderDeliveryMethod,
        status: orderStatus,
    });

    let eta;
    if (milliseconds) {
        const { hrs, mins } = milliseconsExtractor(milliseconds);
        eta = {
            title: formattedETATime(hrs, mins),
            description: "Estime Time Arrival",
            icon: "car-clock",
        };
    }

    const renderAvatar = avatar
        ? (props) => <Avatar.Image style={props.style} source={{ uri: imagekitUrl(avatar) }} />
        : null;

    return (
        <>
{/*             <Divider style={{ marginTop: MD3LightTheme.spacing.x3 }} />
 */}      
            <>
                <List.Item
                        title={name}
                        description={vehicle}
                        left={renderAvatar}
                    />

                {eta ? (
                    <List.Item
                            title={eta.title}
                            description="Estimate Time of Arrival"
                            left={(props) => <List.Icon {...props} icon={eta.icon} />}
                        />
                ) : null}
        
                <List.Item
                    title={status}
                    titleNumberOfLines={0}
                    left={(props) => <List.Icon {...props} icon='message-text-clock-outline' />}
                />

                {phone ? (
                    <List.Item
                        title={phone}
                        left={(props) => <List.Icon {...props} icon={ITEM_TYPE_ICON_MAPPING[ITEM_TYPE.call]} />}
                        onPress={() => makeLinkingCall(phone)}
                    /> 
                ): null}
            </>
        </>
    );
};

export default DriverStatus;
