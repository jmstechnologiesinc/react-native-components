import React from 'react';

import {   Image} from 'react-native';

import { Card,  Button,  Text , List, Divider } from '@jmsstudiosinc/react-native-paper';

import ListItemExtended from '../List/ListItemExtended';
import usePubNubETA from '../PubNubETA/usePubNubETA';
import ChipCountdown from '../PubNubETA/ChipCountdown';
import useCountdown from '../PubNubETA/useCountdown';

export const ORDER_ACTIONS = {
    print: 'print',
    call: 'call',
};

const OrderListCard = ({
    role,
    status,
    fulfilmentStatus,
    title,
    photo,
    description,
    pudMethod,
    formattedOrderId,
    formattedStatusTime,
    driverAvatar,
    orderID,
    durationValue,
    deliveryTime,
    restaurantAcceptedTime,
    onPress,
    onButtonPress,
}) => {
    const orderMilliseconds = useCountdown({
        orderID,
        deliveryMethod: pudMethod,
        status,
        role,
        restaurantAcceptedTime,
        deliveryTime,
        durationValue
    });

    const pubnubMilliseconds = usePubNubETA({
        orderID,
        deliveryMethod: pudMethod,
        status,
        role
    });

    const vendorStatus = fulfilmentStatus.vendor;
    const driverStatus = fulfilmentStatus.driver;

    const renderStatus = [];

    if(vendorStatus.header) {
        renderStatus.push(
            <ListItemExtended
                overline={vendorStatus.overline}
                header={vendorStatus.header}
                subHeader={vendorStatus.subHeader}
                right={<ChipCountdown milliseconds={orderMilliseconds} />} />
        );
    }

    if(driverStatus.overline || driverStatus.header || driverStatus.subHeader || driverStatus.chips.length > 0) {
        renderStatus.push(
            <ListItemExtended
                overline={driverStatus.subHeader}
                header={driverStatus.header}
                subHeader={driverStatus.overline}
                chips={driverStatus.chips}
                avatar={driverAvatar}
                right={<ChipCountdown milliseconds={pubnubMilliseconds} />} />
        );
    }

    return (
        <>
            <Card.Title
                title={title}
                subtitle={`${formattedOrderId} ${description}`}
                left={photo ? () => (<Image
                    source={photo}
                    style={{
                        width: 100,
                        height: 56,
                    }}
                    />) : null
                }
                right={() => (
                    <Text  style={{ marginRight: 16 }}>
                        {status}
                    </Text>
                )}
                leftStyle={{
                    width: 100,
                    height: 56,
                }}
            />
         
            {renderStatus.length > 0 && (
                <List.Section>{renderStatus}</List.Section>
            )}

            {driverStatus.buttons?.length > 0 && (
                <Card.Actions>
                    {driverStatus.buttons.map((button, i) => (
                        <Button
                            onPress={() => onButtonPress?.(button.value)}
                            {...(button.value === ORDER_ACTIONS.print && { icon: 'printer' })}>
                            {button.label}
                        </Button>
                    ))}
                </Card.Actions>
            )}
        </>
    );
};

export default OrderListCard;
