import React from 'react';

import { SectionList } from 'react-native';

import { Divider, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { LAYOUT_MODE, ScreenWrapper, TNEmptyStateView, localized } from '@jmstechnologiesinc/react-native-components';

import { USER_ROLES } from '@jmstechnologiesinc/user';

import { ORDER_LIST_FILTERS } from './utils';

const keyExtractor = (order) => `order-list-${order.id}`;

// ADR-0017 §5.4 — «sin cadenas mágicas».
//
// The empty state was a five-deep nested ternary over `role` and a
// `statusFilter` compared against the bare literal `'active'`, with `localized`
// called TWICE on every branch — once inside, once around — so every string
// was looked up, then looked up again with itself as the key. The second
// lookup always missed and returned its argument, which is the only reason it
// rendered at all.
//
// A table says the same thing and can be read: a role and a filter choose a
// pair of keys. The filter is a named constant (`ORDER_LIST_FILTERS.active`)
// shared with `utils.js`, so the string exists in one place, and a role with
// no entry falls back to the customer's copy instead of to an accidental
// branch.
const EMPTY_STATE = {
    [USER_ROLES.vendor]: {
        [ORDER_LIST_FILTERS.active]: { title: 'noNewOrders', description: 'ordersWillBeListReceives' },
        [ORDER_LIST_FILTERS.history]: { title: 'noRecentOrders', description: 'ordersWillBeListFulfills' },
    },
    [USER_ROLES.driver]: {
        [ORDER_LIST_FILTERS.active]: { title: 'noDeliveries', description: 'deliveriesWillBeListPlaces' },
        [ORDER_LIST_FILTERS.history]: { title: 'noDeliveries', description: 'deliveriesWillBeListPlaces' },
    },
    [USER_ROLES.customer]: {
        [ORDER_LIST_FILTERS.active]: { title: 'noOrders', description: 'noOrdersPlacedMessage' },
        [ORDER_LIST_FILTERS.history]: { title: 'noOrders', description: 'noOrdersPlacedMessage' },
    },
};

const emptyStateConfig = (role, statusFilter) => {
    const byFilter = EMPTY_STATE[role] || EMPTY_STATE[USER_ROLES.customer];
    const keys = byFilter[statusFilter] || byFilter[ORDER_LIST_FILTERS.active];
    return { title: localized(keys.title), description: localized(keys.description) };
};

const OrderSectionList = ({
    data,
    renderItem,
    listHeaderComponent,
    sectionSeparatorComponent = true,
    itemSeparatorComponent = true,
    listSubheaderStyle,
    layoutMode,
    statusFilter,
    role,
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
                <List.Subheader
                    style={[
                        {
                            backgroundColor: MD3LightTheme.colors.background,
                        },
                        listSubheaderStyle,
                    ]}
                >
                    {title}
                </List.Subheader>
            ) : null
        }
        renderItem={renderItem}
        ListEmptyComponent={
            <ScreenWrapper.Container style={{ flex: 1 }}>
                <TNEmptyStateView
                    titleVariant={layoutMode === LAYOUT_MODE.landscape ? 'titleLarge' : undefined}
                    emptyStateConfig={emptyStateConfig(role, statusFilter)}
                />
            </ScreenWrapper.Container>
        }
    />
);

export default OrderSectionList;
