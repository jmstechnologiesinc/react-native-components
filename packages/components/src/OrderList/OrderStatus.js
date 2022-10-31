import React from 'react';

import { View } from 'react-native';

import { Chip, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import ListItemExtended from '../List/ListItemExtended';
import ChipCountdown from './ChipCountdown';
import usePubNubETA from './usePubNubETA';
import useCountdown from './useCountdown';

const OrderStatus = ({
    status,
    deliveryMethod,
    durationValue,
    deliveryTime,
    restaurantAcceptedTime,
    role,
    orderID,
    fulfilmentStatus,
    showHeaderAvatar,
    headerTitleVariant,
}) => {
    const orderMilliseconds = useCountdown({
        orderID,
        deliveryMethod,
        status,
        role,
        restaurantAcceptedTime,
        deliveryTime,
        durationValue,
    });

    const pubnubMilliseconds = usePubNubETA({
        orderID,
        deliveryMethod,
        status,
        role,
    });

    const headerStatus = fulfilmentStatus.header;
    const vendorStatus = fulfilmentStatus.vendor;
    const driverStatus = fulfilmentStatus.driver;

    const renderStatuses = [];

    const rightWrapper = (child) => (
        <View
            style={{
                justifyContent: 'center',
                marginLeft: MD3LightTheme.spacing.xSmall,
                marginRight: MD3LightTheme.spacing.xSmall / 2,
            }}
        >
            {child}
        </View>
    );

    if (headerStatus?.title) {
        renderStatuses.push(
            <ListItemExtended
                overline={headerStatus.overlines.join(' · ') || null}
                header={headerStatus.title}
                subHeader={headerStatus.description}
                avatar={showHeaderAvatar && headerStatus.avatar}
                right={headerStatus.right && rightWrapper(<Chip>{headerStatus.right}</Chip>)}
                titleVariant={headerTitleVariant}
            />
        );
    }

    if (vendorStatus.title) {
        renderStatuses.push(
            <ListItemExtended
                overline={vendorStatus.overlines.join(' · ') || null}
                header={vendorStatus.title}
                subHeader={vendorStatus.description}
                chips={vendorStatus.chips}
                avatar={vendorStatus.avatar}
                right={rightWrapper(<ChipCountdown milliseconds={orderMilliseconds} />)}
                style={{ paddingTop: 0 }}
            />
        );
    }

    if (driverStatus.overline || driverStatus.title || driverStatus.description || driverStatus.chips.length > 0) {
        renderStatuses.push(
            <ListItemExtended
                overline={driverStatus.overline}
                header={driverStatus.title}
                subHeader={driverStatus.description}
                chips={driverStatus.chips}
                avatar={driverStatus.avatar}
                right={rightWrapper(<ChipCountdown milliseconds={pubnubMilliseconds} />)}
                style={{ paddingTop: 0 }}
            />
        );
    }

    return renderStatuses;
};

export default OrderStatus;
