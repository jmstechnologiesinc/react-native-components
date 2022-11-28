import React from "react";

import { View } from "react-native";

import { MD3LightTheme, List } from "@jmsstudiosinc/react-native-paper";

import TimeCountdown from "./TimeCountdown";
import ListItemExtended from "../List/ListItemExtended";
import usePubNubETA from "./usePubNubETA";

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

const DriverStatus = ({
    role,
    orderID,
    status,
    deliveryMethod,
    overline,
    header,
    subHeader,
    chips,
    avatar,
    titleStyle,
    overlineStyle,
}) => {
    const pubnubMilliseconds = usePubNubETA({
        role,
        orderID,
        deliveryMethod,
        status
    });

    const avatarFallback = avatar ? {avatar} : {left: (props) => <List.Icon {...props} icon="car" />}
    return (
        <ListItemExtended
            overline={overline}
            header={header}
            subHeader={subHeader}
            chips={chips}
            right={rightWrapper(<TimeCountdown milliseconds={pubnubMilliseconds} />)}
            {...avatarFallback}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
            style={{ paddingTop: 0 }}
        />
    )
}

export default DriverStatus