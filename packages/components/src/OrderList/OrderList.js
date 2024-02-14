import React from 'react';

import { SectionList } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import OrderListItem from './OrderListItem';
import { LAYOUT_MODE } from '../consts';
import { isOrderActive } from '@jmstechnologiesinc/order';
import { USER_ROLES } from '@jmstechnologiesinc/user';

const keyExtractor = (order) => `order-list-${order.id}`;
const horizontalInsetDivider = (data, role) => <Divider 
        horizontalInset
        style={role === USER_ROLES.customer && isOrderActive(data.trailingItem?.status) ? {marginBottom: MD3LightTheme.spacing.x2} : null} />;

const OrderList = ({
    data,
    role,
    currentOrderId,
    showItemSeparator = true,
    listHeaderComponent,
    listEmptyComponent,
    layoutMode = LAYOUT_MODE.portrait,
    showSelectedOverlay,

    enableHeaderStatus,
    enableVendorStatus,

    showHeaderOverline,
    showHeaderTitle,
    showHeaderDescription,
    showHeaderAvatar,

    showVendorOverline,
    showVendorTitle,
    showVendorDescription,
    showVendorAvatar,
    showChevron,

    onButtonPress,
    onPress,
    
}) => (
    <SectionList
        keyExtractor={keyExtractor}
        sections={data}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={listEmptyComponent}
        renderSectionHeader={({ section: { title } }) =>
            title !== null ? (
                <List.Subheader
                    style={{
                        ...(layoutMode === LAYOUT_MODE.landscape && { paddingHorizontal: 0 }),
                        backgroundColor: MD3LightTheme.colors.background,
                    }}
                >
                    {title}
                </List.Subheader>
            ) : null
        }
        SectionSeparatorComponent={showItemSeparator ? Divider : null}
        ItemSeparatorComponent={showItemSeparator ? (data) => horizontalInsetDivider(data, role) : null}
        renderItem={({ item }) => (
            <OrderListItem
                role={role}
                order={item}
                showSelectedOverlay={showSelectedOverlay}
                currentOrderId={currentOrderId}
                enableHeaderStatus={enableHeaderStatus}
                enableVendorStatus={enableVendorStatus}
                showHeaderOverline={showHeaderOverline}
                showHeaderTitle={showHeaderTitle}
                showHeaderDescription={showHeaderDescription}
                showHeaderAvatar={showHeaderAvatar}
                showVendorOverline={showVendorOverline}
                showVendorTitle={showVendorTitle}
                showVendorDescription={showVendorDescription}
                showVendorAvatar={showVendorAvatar}
                showChevron={showChevron}
                onButtonPress={onButtonPress}
                onPress={() => onPress(item, role)}
            />
        )}
    />
);

export default OrderList;
