import React from 'react';

import { formattedETATime, ITEM_TYPE, milliseconsExtractor } from '@jmstechnologiesinc/commons';

import usePubNubETA from './usePubNubETA';
import OrderStatusWrapper from './OrderStatusWrapper';

const DriverStatus = ({
    role,
    orderID,
    status,
    deliveryMethod,

    header,
    subHeader,
    chips,
    avatar,

    showOverline,
    showTitle,
    showDescription,
    showAvatar,

    titleStyle,
    overlineStyle,
}) => {
    const milliseconds = usePubNubETA({
        role,
        orderID,
        deliveryMethod,
        status,
    });

    const renderChips = [];
    if (milliseconds) {
        const { hrs, mins } = milliseconsExtractor(milliseconds);
        renderChips.push({
            formattedValue: formattedETATime(hrs, mins),
            type: ITEM_TYPE.eta,
        });
    }

    renderChips.push(...chips);

    return (
        <OrderStatusWrapper
            header={header}
            subHeader={subHeader}
            chips={renderChips}
            avatar={avatar}
            showOverline={showOverline}
            showTitle={showTitle}
            showDescription={showDescription}
            showAvatar={showAvatar}
            style={{ paddingTop: 0 }}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
        />
    );
};

export default DriverStatus;
