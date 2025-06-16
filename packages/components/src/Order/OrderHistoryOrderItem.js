import React from 'react';

import { List as JMSList, imageKitAvatar, localized } from '@jmstechnologiesinc/react-native-components';

import { interpunct, findAccountingItem, ACCOUNTING_ITEMS} from '@jmstechnologiesinc/commons';
import {formatOrderID} from '@jmstechnologiesinc/order';
import { Avatar} from '@jmstechnologiesinc/react-native-paper';

const OrderHistoryOrderItem = ({
    id,
    title,
    photo,
    icon='car-clock',
    status,
    platform,
    formattedTripStatus,
    amount,
    items=[]
}) => {
    const renderDescription = [
        interpunct([
            formatOrderID(id), 
            platform,
            findAccountingItem(amount, ACCOUNTING_ITEMS.total)?.formattedValue
    ]),
        interpunct([localized(status), formattedTripStatus])
    ];

    const renderLeft = photo ? (
        (props) => <Avatar.Image 
            source={{ uri: imageKitAvatar(photo) }}
            style={props.style}  />
    ) : (
        (props) => <Avatar.Icon 
            icon={icon}   
            style={props.style} />
    );

    return (
        <JMSList.Item
            title={title}
            description={renderDescription}
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            chips={items.map(JMSList.Chip)}
            left={renderLeft} /> 
    )
}

export default OrderHistoryOrderItem;
