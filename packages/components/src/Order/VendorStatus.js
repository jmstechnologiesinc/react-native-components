import React from 'react';

import { interpunct } from '@jmstechnologiesinc/commons';

import OrderStatusWrapper from './OrderStatusWrapper';

const VendorStatus = ({
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
    /*   const milliseconds = usePreparingTimeCoutdown({
        role,
        orderId: orderId,
        deliveryMethod: deliveryMethod,
        status: status,
        vendorAcceptedTime: vendorAcceptedTime,
        deliveryTime: deliveryTime,
        durationValue: durationValue,
    }); */

    /*  const renderChips = [...chips];
    if(milliseconds !== undefined) {
        const {hrs, mins} = milliseconsExtractor(milliseconds);
        renderChips.push(formattedETATime(hrs, mins));
    } */

    return (
        <OrderStatusWrapper
            overline={interpunct(overline)}
            header={header}
            subHeader={subHeader}
            chips={chips}
            avatar={avatar}
            showOverline={showOverline}
            showTitle={showTitle}
            showDescription={showDescription}
            showChevron={false}
            showAvatar={showAvatar}
            style={{ paddingTop: 0 }}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
        />
    );
};

export default VendorStatus;
