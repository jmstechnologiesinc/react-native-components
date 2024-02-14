import React from 'react';

import { List, MD3LightTheme, TouchableRipple } from '@jmstechnologiesinc/react-native-paper';

import {  isOrderActive } from '@jmstechnologiesinc/order';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import TouchableRippleWrapper from '../TouchableRippleWrapper/TouchableRippleWrapper';
import DriverStatus from '../Order/DriverStatus';
import { imagekitUrl,PhotoGallery,ScreenWrapper } from '@jmstechnologiesinc/react-native-components';
import { USER_ROLES } from '@jmstechnologiesinc/user';

const OrderListItem = ({
    role,
    order,
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
    const formattedOrder = formatOrder(order, role);

    const isSelected = currentOrderId === order?.id && showSelectedOverlay;
    const contentColor = isSelected ? { color: MD3LightTheme.colors.onSecondaryContainer } : null;

    const renderStatus = (
        <>
            {role === USER_ROLES.customer && isOrderActive(formattedOrder.status) ? (
                <ScreenWrapper.Container>
                    <PhotoGallery 
                        photos={imagekitUrl([formattedOrder.photo])} 
                        showNav={false}
                        styles={{paddingTop: MD3LightTheme.spacing.x2}}
              />
                </ScreenWrapper.Container>
            ) : null}

            <OrderStatus
                role={role}
                formattedOrder={formattedOrder}
                enableHeaderStatus={enableHeaderStatus}
                enableVendorStatus={enableVendorStatus}
                showHeaderOverline={showHeaderOverline}
                showHeaderTitle={showHeaderTitle}
                showHeaderDescription={isOrderActive(formattedOrder.status) === false}
                showHeaderAvatar={isOrderActive(formattedOrder.status) === false}
                showVendorOverline={showVendorOverline}
                showVendorTitle={showVendorTitle}
                showVendorDescription={showVendorDescription}
                showChevron={showChevron}
                showVendorAvatar={showVendorAvatar}
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
                    orderId={formattedOrder.orderId}
                    orderStatus={formattedOrder.status}
                    orderDeliveryMethod={formattedOrder.deliveryMethod}
                    deliveryMethod={formattedOrder.fulfilmentStatus.deliveryMethod}
                    name={formattedOrder.fulfilmentStatus.driver.title}
                    phone={formattedOrder.fulfilmentStatus.driver.phone}
                    vehicle={formattedOrder.fulfilmentStatus.driver.vehicle}
                    avatar={formattedOrder.fulfilmentStatus.driver.avatar}
                    status={formattedOrder.fulfilmentStatus.driver.status}
                    showPhoneNumber={false}
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
