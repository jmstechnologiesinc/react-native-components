import React from 'react';

import { List, MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import { ORDER_STATUS, ORDER_STATUS_CANCELLED, ORDER_STATUS_PREPARING } from '@jmstechnologiesinc/order';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import TouchableRippleWrapper from '../TouchableRippleWrapper/TouchableRippleWrapper';
import DriverStatus from './DriverStatus';
import { imagekitUrl,PhotoGallery,ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import { USER_ROLES } from '@jmstechnologiesinc/user';

const OrderListItem = ({
    role,
    order,
    currentOrderId,
    showSelectedOverlay = false,

    enableDriverStatus,
    enableHeaderStatus,
    enableVendorStatus,

    showHeaderOverline,
    showHeaderTitle,
    showHeaderAvatar,

    showVendorOverline,
    showVendorTitle,
    showVendorDescription,
    showVendorAvatar,

    showDriverOverline,
    showDriverTitle,
    showDriverDescription,
    showDriverAvatar,

    onButtonPress,
    onPress,
    
}) => {
    const formattedOrder = formatOrder(order, role);

    const showHeaderDescription =
        ORDER_STATUS_PREPARING(formattedOrder.status) ||
        formattedOrder.status === ORDER_STATUS.shipped ||
        ORDER_STATUS_CANCELLED(formattedOrder.status) ||
        formattedOrder.status === ORDER_STATUS.completed;

    const isSelected = currentOrderId === order?.id && showSelectedOverlay;
    const contentColor = isSelected ? { color: MD3LightTheme.colors.onSecondaryContainer } : null;

    const renderStatus = (
        <>
            {role === USER_ROLES.customer && (
                ORDER_STATUS_PREPARING(formattedOrder.status) ||
                formattedOrder.status === ORDER_STATUS.shipped ||
                formattedOrder.status === ORDER_STATUS.inTransit ||
                formattedOrder.status === ORDER_STATUS.placed
            ) ? (
                <ScreenWrapper.Container>
                    <PhotoGallery 
                        photos={imagekitUrl([formattedOrder.photo])} 
                        showNav={false}
                        styles={{marginTop: MD3LightTheme.spacing.x2}} />
                </ScreenWrapper.Container>
            ) : null}

            <OrderStatus
                role={role}
                formattedOrder={formattedOrder}
                enableHeaderStatus={enableHeaderStatus}
                enableVendorStatus={enableVendorStatus}
                enableDriverStatus={enableDriverStatus}
                showHeaderOverline={showHeaderOverline}
                showHeaderTitle={showHeaderTitle}
                showHeaderDescription={showHeaderDescription}
                showHeaderAvatar={ORDER_STATUS_CANCELLED(formattedOrder.status) ||
                    formattedOrder.status === ORDER_STATUS.completed}
                showVendorOverline={showVendorOverline}
                showVendorTitle={showVendorTitle}
                showVendorDescription={showVendorDescription}
                showVendorAvatar={showVendorAvatar}
                showDriverOverline={showDriverOverline}
                showDriverTitle={showDriverTitle}
                showDriverDescription={showDriverDescription}
                showDriverAvatar={showDriverAvatar}
                titleStyle={contentColor}
                overlineStyle={contentColor}
            />

            {role === USER_ROLES.customer && (
                formattedOrder.fulfilmentStatus.driver.description.length > 0 || 
                formattedOrder.fulfilmentStatus.driver.title || 
                formattedOrder.fulfilmentStatus.driver.chips.length > 0
            ) ? (
                <DriverStatus
                    role={role}
                    orderID={formattedOrder.orderID}
                    orderStatus={formattedOrder.status}
                    orderDeliveryMethod={formattedOrder.deliveryMethod}
                    deliveryMethod={formattedOrder.fulfilmentStatus.deliveryMethod}
                    name={formattedOrder.fulfilmentStatus.driver.title}
                    phone={formattedOrder.fulfilmentStatus.driver.phone}
                    vehicle={formattedOrder.fulfilmentStatus.driver.vehicle}
                    avatar={formattedOrder.fulfilmentStatus.driver.avatar}
                    status={formattedOrder.fulfilmentStatus.driver.status}
                />
            ) : null}

            {onButtonPress && (
                <List.Section>
                    <ActionGroup.Group>
                        <ActionGroup.Buttons
                            buttons={formattedOrder.fulfilmentStatus.buttons}
                            onPress={(button) => onButtonPress(button, order.id)}
                        />
                    </ActionGroup.Group>
                </List.Section>
            )}
        </>
    );

    return showSelectedOverlay ? (
        <TouchableRippleWrapper isSelected={isSelected} onPress={onPress}>{renderStatus}</TouchableRippleWrapper>
    ) : <TouchableRipple onPress={onPress}>{renderStatus}</TouchableRipple>;
};

export default OrderListItem;
