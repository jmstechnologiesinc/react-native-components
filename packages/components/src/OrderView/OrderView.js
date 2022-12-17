import React from 'react';

import { ScrollView, View} from 'react-native';

import { Divider, List, MD3Colors } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import {  PUB } from '@jmsstudiosinc/vendor';
import { ORDER_STATUS_CANCELLED, ORDER_STATUS, formatedOrderStatusTime, ORDER_ACTIONS } from '@jmsstudiosinc/order';

import Accounting from '../Checkout/Accounting';
import CartListProductItem from '../CartList/CartListProductItem';
import { formatOrder } from '../Order/utils';
import OrderStatus from '../Order/OrderStatus';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import * as ActionGroup from '../ActionGroup/ActionGroup';
import { itemSeparator } from '../utils';
import { plurulize } from '@jmsstudiosinc/commons';
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { MATERIAL_ICONS } from '@jmsstudiosinc/commons';
import styles from '../styles';

const OrderView = ({ 
    order, 
    role, 
    onButtonPress,

    enableDriverStatus,
    enableHeaderStatus,
    enableVendorStatus,
    
    showHeaderOverline,
    showHeaderTitle,
    showHeaderDescription,
    showHeaderAvatar = false,
    
    showVendorOverline = false,
    showVendorTitle,
    showVendorDescription,
    showVendorAvatar = false,
  
    showDriverOverline,
    showDriverTitle,
    showDriverDescription,
    showDriverAvatar,
}) => {
    if(!order?.id || !USER_ROLES[role]) {
        return null;
    }

    const fulfilmentDetails = [];
    const driverDetails = [];

    if (order.note === true) {
        fulfilmentDetails.push({
            key: "cancel-note",
            title: order.cancelNote,
            description: 'Note',
        });
    }

    if ((order.status === ORDER_STATUS.completed || ORDER_STATUS_CANCELLED(order.status) === true)) {
        fulfilmentDetails.push({
            key: "status-date",
            title: formatedOrderStatusTime(order),
            icon: MATERIAL_ICONS.calendar,
        });
    }

    if(role === USER_ROLES.vendor || role === USER_ROLES.customer) {
        if (order.fulfillmentMethod === PUB.delivery) {
            if(order.driver) {
                driverDetails.push({
                    key: "delivery-method",
                    title: order.driver.deliveryMethod,
                    description: 'Driver Type'
                });    
                driverDetails.push({
                    key: "driver-name",
                    title: order.driver?.formattedName,
                    icon: MATERIAL_ICONS.account
                });
                if(order.driver.phone) {
                    driverDetails.push({
                        key: "driver-phone",
                        title: order.driver.phone,
                        icon: MATERIAL_ICONS.call
                    });
                }
            }
        } else if (order.fulfillmentMethod === PUB.pickup) {
            fulfilmentDetails.push({
                key: "delivery-method",
                title: order.deliveryMethod,
                description: 'Fulfillment Method',
                icon: MATERIAL_ICONS.fulfillmentMethod
            });
        }
    }

    if (role === USER_ROLES.vendor || role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: "author-name",
            title: order.author.formattedName,
            icon: MATERIAL_ICONS.account
        });

        if(order.author.phone) {
            fulfilmentDetails.push({
                key: "author-phone",
                title: order.author.phone,
                icon: MATERIAL_ICONS.call
            });
        }
    }

    if(order.fulfillmentMethod === PUB.delivery) {
        fulfilmentDetails.push({
            key: "shipping-address",
            title: order.fulfillmentAddress.formattedAddress,
            icon: MATERIAL_ICONS.location
        });
    } else if(role === USER_ROLES.customer && order.fulfillmentMethod === PUB.pickup) {
        fulfilmentDetails.push({
            key: "pickup-address",
            title: order.restaurant.location.formattedAddress,
            icon: MATERIAL_ICONS.location
        });
    }

    if (role === USER_ROLES.customer || role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: "vendor-phone",
            title: order.restaurant.phone,
            icon: MATERIAL_ICONS.call,
            description: 'Vendor Phone'
        });
    }

    let formattedOrder = formatOrder(order, role);
    formattedOrder = {
        ...formattedOrder,
        fulfilmentStatus: {
            ...formattedOrder.fulfilmentStatus,
            header: {
                ...formattedOrder.fulfilmentStatus.header,
                overlines: [formattedOrder.fulfilmentStatus.header.overlines[0]]
            }
        }
    }
   
    const buttonsMapping = formattedOrder.fulfilmentStatus.buttons.map(button => {
         if(ORDER_STATUS_CANCELLED(button.value)) {
            return {
                ...button,
                mode: 'text',
                compact: true,
                textColor: MD3Colors.error50,
                contentStyle: {flexGrow: 2}
            }
        } else if(button.value === ORDER_ACTIONS.print) {
            return {
                ...button,
                icon: MATERIAL_ICONS.printer,
                mode: "text",
                contentStyle: {flexGrow: 2}
            }
        }

        return {
            ...button,
            compact: false,
            contentStyle: {flexGrow: 3}
        };
    });

    const renderActionButtons = ((onButtonPress && buttonsMapping.length > 0) ? (
        <ScreenWrapper.Container>
            <ScreenWrapper.Section>
                <ActionGroup.Group >
                    <ActionGroup.Buttons 
                        buttons={buttonsMapping}
                        onPress={(button) => onButtonPress(button, formattedOrder.orderID)}  />
                </ActionGroup.Group>
            </ScreenWrapper.Section>
        </ScreenWrapper.Container>
    ) : null);

    return (
        <>
            <ScrollView  
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false} >
                <View style={{ flex: 1 }}>
                    {role === USER_ROLES.customer || role === USER_ROLES.driver ? (
                        <PhotoGallery photos={[formattedOrder.photo]} />
                    ) : null}
                    
                    <OrderStatus
                        role={role}
                        formattedOrder={formattedOrder} 
                        headerTitleVariant={'headlineSmall'}

                        enableHeaderStatus={enableHeaderStatus}
                        enableVendorStatus={enableVendorStatus}
                        enableDriverStatus={enableDriverStatus}

                        showHeaderOverline={showHeaderOverline}
                        showHeaderTitle={showHeaderTitle}
                        showHeaderDescription={showHeaderDescription}
                        showHeaderAvatar={showHeaderAvatar}
                        
                        showVendorOverline={showVendorOverline}
                        showVendorTitle={showVendorTitle}
                        showVendorDescription={showVendorDescription}
                        showVendorAvatar={showVendorAvatar}
                    
                        showDriverOverline={showDriverOverline}
                        showDriverTitle={showDriverTitle}
                        showDriverDescription={showDriverDescription}
                        showDriverAvatar={showDriverAvatar}
                    />

                    {(role === USER_ROLES.vendor || role === USER_ROLES.customer) && (
                        <List.Section title={`${order.products.length} ${plurulize('Item', order.products.length)}`}>
                            {order.products.map((item, index) => (
                                <View key={`product-item-${item.id}`}>
                                    <CartListProductItem data={item} interpunctAttributeGroup={false} />
                                    {itemSeparator(index, order.products.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    )}

                    {fulfilmentDetails.length > 0 && (
                        <List.Section title={order.fulfillmentMethod === PUB.delivery ? 'Delivery Details' : 'Pickup Details'}>
                            {fulfilmentDetails.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item 
                                        title={item.title} 
                                        description={item.description} 
                                        titleNumberOfLines={0}
                                        descriptionNumberOfLines={0}
                                        left={(props) => <List.Icon {...props} icon={item.icon} />} />
                                    {itemSeparator(index, fulfilmentDetails.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    )}

                    {driverDetails.length > 0 && (
                        <List.Section title={"Driver Details"}>
                            {driverDetails.map((item, index) => (
                                <View key={item.key}>
                                    <List.Item 
                                        title={item.title} 
                                        description={item.description}
                                        titleNumberOfLines={0}
                                        descriptionNumberOfLines={0} 
                                        {...(item.icon ? {left: (props) => <List.Icon {...props} icon={item.icon} />} : null)} />
                                    {itemSeparator(index, driverDetails.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    )}  

                    <ScreenWrapper.Section>
                        <Accounting fees={formattedOrder.fees} />
                    </ScreenWrapper.Section>
                    {role === USER_ROLES.customer && renderActionButtons}
                </View>
            </ScrollView>
      
            {role === USER_ROLES.vendor && renderActionButtons}
        </>
    );
};

export default OrderView;
