import React from 'react';

import { ScrollView, View} from 'react-native';

import { Divider, List, MD3Colors } from '@jmsstudiosinc/react-native-paper';

import { USER_ROLES } from '@jmsstudiosinc/user';
import {  FULFILLMENT_METHODS } from '@jmsstudiosinc/vendor';
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

const getDriverDetails = (order, role) => {
    const results = [];

    if(order.driver) {
        if(role === USER_ROLES.vendor) {
            results.push({
                key: "delivery-method",
                title: order.driver.deliveryMethod,
                description: 'Driver Type'
            });
        }
        results.push({
            key: "driver-name",
            title: order.driver?.formattedName,
            icon: MATERIAL_ICONS.account
        });

        if(order.driver.phone) {
            results.push({
                key: "driver-phone",
                title: order.driver.phone,
                icon: MATERIAL_ICONS.call
            });
        }
    }

    return results;
}

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

    let driverDetails;

    if(role === USER_ROLES.customer) {
        fulfilmentDetails.push({
            key: "fulfillment-address",
            title: order.fulfillmentAddress.formattedAddress,
            icon: MATERIAL_ICONS.location,
            description: order.fulfillmentMethod === FULFILLMENT_METHODS.delivery ? 'Shipping Address' : 'Pickup Address'
        });

        fulfilmentDetails.push({
            key: "vendor-phone",
            title: order.vendor.phone,
            icon: MATERIAL_ICONS.call,
            description: 'Vendor Phone'
        });

        if (order.fulfillmentMethod === FULFILLMENT_METHODS.delivery) {
            driverDetails = getDriverDetails(order);
        } else if (order.fulfillmentMethod === FULFILLMENT_METHODS.pickup) {
       
        }
    } else if (role === USER_ROLES.vendor) {
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

        if (order.fulfillmentMethod === FULFILLMENT_METHODS.delivery) {
            fulfilmentDetails.push({
                key: "fulfillment-address",
                title: order.fulfillmentAddress.formattedAddress,
                icon: MATERIAL_ICONS.location
            });

            driverDetails = getDriverDetails(order, role);
        } else if (order.fulfillmentMethod === FULFILLMENT_METHODS.pickup) {
       
        }
    } else if (role === USER_ROLES.driver) {
        fulfilmentDetails.push({
            key: "vendor-phone",
            title: order.vendor.phone,
            icon: MATERIAL_ICONS.call,
            description: 'Vendor Phone'
        });

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

                    {fulfilmentDetails.length > 0 ? (
                        <List.Section title={order.fulfillmentMethod === FULFILLMENT_METHODS.delivery ? 'Delivery Details' : 'Pickup Details'}>
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
                    ) : null}

                    {driverDetails?.length > 0 ? (
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
                    ) : null}

                    {(role === USER_ROLES.vendor || role === USER_ROLES.customer) ? (
                        <List.Section title={`${order.products.length} ${plurulize('Item', order.products.length)}`}>
                            {order.products.map((item, index) => (
                                <View key={`product-item-${item.id}`}>
                                    <CartListProductItem data={item} interpunctAttributeGroup={false} />
                                    {itemSeparator(index, order.products.length) && <Divider />}
                                </View>
                            ))}
                        </List.Section>
                    ) : null}

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