import React from 'react';

import { SectionList } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { LAYOUT_MODE, ScreenWrapper,TNEmptyStateView, localized } from '@jmstechnologiesinc/react-native-components';

import { USER_ROLES } from '@jmstechnologiesinc/user';

const keyExtractor = (order) => `order-list-${order.id}`;

const OrderSectionList = ({
    data,
    renderItem,
    listHeaderComponent,
    sectionSeparatorComponent=true,
    itemSeparatorComponent=true,
    listSubheaderStyle,
    layoutMode,
    statusFilter,
    role
}) => (
    <SectionList
        keyExtractor={keyExtractor}
        sections={data}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        SectionSeparatorComponent={sectionSeparatorComponent ? Divider : null}
        ItemSeparatorComponent={itemSeparatorComponent ? () => <Divider horizontalInset /> : itemSeparatorComponent}
        ListHeaderComponent={listHeaderComponent}
        renderSectionHeader={({ section: { title } }) =>
            title !== null ? (
                <List.Subheader style={[{
                    backgroundColor: MD3LightTheme.colors.background,
                }, listSubheaderStyle]}>
                    {title}
                </List.Subheader>
            ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={ <>
            <ScreenWrapper.Container style={{ flex: 1 }}>
                <TNEmptyStateView
                    titleVariant={layoutMode === LAYOUT_MODE.landscape ? 'titleLarge' : undefined}
                    emptyStateConfig={{
                        title: localized(
                            role === USER_ROLES.vendor
                                ? statusFilter === 'active'
                                    ? localized('noNewOrders')
                                    : localized('noRecentOrders')
                                : role === USER_ROLES.driver
                                ? localized('noDeliveries')
                                : localized('noOrders')
                        ),
                        description: localized(
                            role === USER_ROLES.vendor
                                ? statusFilter === 'active'
                                    ? localized('ordersWillBeListReceives')
                                    : localized('ordersWillBeListFulfills')
                                : role === USER_ROLES.customer
                                ? localized('noOrdersPlacedMessage')
                                : role === USER_ROLES.vendor
                                ? localized('ordersWillBeListPlaces')
                                : localized('deliveriesWillBeListPlaces')
                        ),
                    }}
                />
            </ScreenWrapper.Container>
        </>} />
);

export default OrderSectionList;
