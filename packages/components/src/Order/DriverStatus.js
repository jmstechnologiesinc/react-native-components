import React from "react";

import { formattedETATime, interpunct, milliseconsExtractor } from "@jmsstudiosinc/commons";

import usePubNubETA from "./usePubNubETA";
import OrderStatusWrapper from "./OrderStatusWrapper";

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
        status
    });

    const renderChips = [...chips];
    if(milliseconds !== undefined) {
        const {hrs, mins} = milliseconsExtractor(milliseconds);
        renderChips.push(formattedETATime(hrs, mins));
    }

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
            
            style={{paddingTop: 0}}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
        />
    )
}

export default DriverStatus