import React from "react";

import { View } from "react-native";

import { MD3LightTheme } from "@jmsstudiosinc/react-native-paper";

import usePreparingTimeCoutdown from "./usePreparingTimeCoutdown";
import TimeCountdown from "./TimeCountdown";
import ListItemExtended from "../List/ListItemExtended";

const rightWrapper = (child) => (
    <View
        style={{
            justifyContent: 'center',
            marginLeft: MD3LightTheme.spacing.x4,
            marginRight: MD3LightTheme.spacing.x2,
        }}
    >
        {child}
    </View>
);

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
    titleStyle,
    overlineStyle,
}) => {
    const orderMilliseconds = usePreparingTimeCoutdown({
        role,
        orderID: orderID,
        deliveryMethod: deliveryMethod,
        status: status,
        restaurantAcceptedTime: restaurantAcceptedTime,
        deliveryTime: deliveryTime,
        durationValue: durationValue,
    });

    return (
        <ListItemExtended
            overline={overline}
            header={header}
            subHeader={subHeader}
            chips={chips}
            avatar={avatar}
            right={rightWrapper(<TimeCountdown milliseconds={orderMilliseconds} />)}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
            style={{ paddingTop: 0 }}
        />
    )
}

export default VendorStatus