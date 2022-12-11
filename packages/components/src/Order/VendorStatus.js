import React from "react";

import { milliseconsExtractor, formattedETATime, interpunct } from '@jmsstudiosinc/commons';

import usePreparingTimeCoutdown from "./usePreparingTimeCoutdown";
import OrderStatusWrapper from "./OrderStatusWrapper";

const VendorStatus = ({
    role,
    orderID,
    deliveryMethod,
    status,
    restaurantAcceptedTime,
    deliveryTime,
    durationValue,

    overline,
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
    const milliseconds = usePreparingTimeCoutdown({
        role,
        orderID: orderID,
        deliveryMethod: deliveryMethod,
        status: status,
        restaurantAcceptedTime: restaurantAcceptedTime,
        deliveryTime: deliveryTime,
        durationValue: durationValue,
    });

    const renderChips = [...chips];
    if(milliseconds !== undefined) {
        const {hrs, mins} = milliseconsExtractor(milliseconds);
        //renderChips.push(formattedETATime(hrs, mins));
    }

    return (
        <OrderStatusWrapper
            overline={interpunct(overline)}
            header={header}
            subHeader={subHeader}
            chips={renderChips}
            avatar={avatar}
            
            showOverline={showOverline}
            showTitle={showTitle}
            showDescription={showDescription}
            showAvatar={showAvatar}
            
            style={{paddingTop: 0}}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
        />
    )
}

export default VendorStatus