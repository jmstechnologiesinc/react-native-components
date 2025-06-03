import React from 'react';

import { List, MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import { ORDER_STATUS, isOrderActive } from '@jmstechnologiesinc/order';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import TouchableRippleWrapper from '../TouchableRippleWrapper/TouchableRippleWrapper';
import DriverInfoListItem from '../Order/DriverInfoListItem';
import { PhotoGallery, ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import { USER_ROLES } from '@jmstechnologiesinc/user';
import { LOGISTICS_PLATFORMS } from '@jmstechnologiesinc/commons';

const OrderListItem = ({
    role,
    order,
    platform,
    currentOrderId,
    showSelectedOverlay = false,

    enableHeaderStatus,
    enableVendorStatus,

    showHeaderOverline,
    showHeaderTitle,

    showVendorOverline,
    showVendorTitle,
    showVendorDescription,
    showVendorAvatar,
    showChevron,

    onButtonPress,
    onPress,
}) => {
    const formattedOrder = formatOrder(order, role, platform);
console.log(JSON.stringify(formattedOrder,null,2),3)
    const isSelected = currentOrderId === order?.id && showSelectedOverlay;
    const contentColor = isSelected ? { color: MD3LightTheme.colors.onSecondaryContainer } : null;

    const renderStatus = (
        <>
            {platform === LOGISTICS_PLATFORMS.shopping && role === USER_ROLES.customer && isOrderActive(formattedOrder.status) ? (
                <ScreenWrapper.Container>
                    <PhotoGallery
                        photos={[formattedOrder.photo]}
                        imagekitCropMode="c-maintain_ratio"
                        showNav={false}
                        styles={{ paddingTop: MD3LightTheme.spacing.x2 }} />
                </ScreenWrapper.Container>
            ) : null}

            <OrderStatus
                role={role}
                platform={platform}
                formattedOrder={formattedOrder}
                enableVendorStatus={enableVendorStatus}
                showHeaderOverline={showHeaderOverline}
                showHeaderTitle={showHeaderTitle}
                enableHeaderStatus={isOrderActive(formattedOrder.status) === false}
                showHeaderDescription={isOrderActive(formattedOrder.status) === false}
                showHeaderAvatar={isOrderActive(formattedOrder.status) === false}
                showVendorOverline={showVendorOverline}
                showVendorTitle={showVendorTitle}
                showVendorDescription={showVendorDescription}
                showChevron={showChevron}
                showVendorAvatar={showVendorAvatar}
                titleStyle={contentColor}
                overlineStyle={contentColor} />

            {role === USER_ROLES.customer && ((order.status === ORDER_STATUS.shipped || order.status === ORDER_STATUS.inTransit)) ? (
                <DriverInfoListItem
                    role={role}
                    orderId={order.id}
                    partnership={order?.driver?.deliveryMethod}
                    name={order.driver?.formattedName}
                    phoneNumber={order.driver?.phoneNumber}
                    vehicle={order.driver?.vehicle?.formattedValue}
                    photo={order.driver?.photo}
                    formattedTripStatus={formattedOrder.fulfilmentStatus.driver.formattedTripStatus}
                    showPhoneNumber={false}
                    isDriverPartnerShipVisible={false} />
            ) : null}

            {onButtonPress && (
                <List.Section>
                    <ActionGroup.Group>
                        <ActionGroup.Buttons
                            buttons={formattedOrder.fulfilmentStatus.buttons}
                            onPress={(button) => onButtonPress(button, order.id)}/>
                    </ActionGroup.Group>
                </List.Section>
            )}
        </>
    );

    return showSelectedOverlay ? (
        <TouchableRippleWrapper
            isSelected={isSelected}
            onPress={onPress}>
            {renderStatus}
        </TouchableRippleWrapper>
    ) : (
        <TouchableRipple onPress={onPress}>
            {renderStatus}
        </TouchableRipple>
    );
};

export default OrderListItem;
