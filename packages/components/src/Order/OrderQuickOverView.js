import React from 'react';

import { Card, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { localized } from '@jmstechnologiesinc/react-native-components';

import { interpunct, MATERIAL_ICONS, plurulize } from '@jmstechnologiesinc/commons';
import { formatOrderID } from '@jmstechnologiesinc/order';

export function formatQuickOrderViewDescription(orderId, itemQuantity, amount) {
    return interpunct([
        formatOrderID(orderId),
        `${itemQuantity} ${plurulize(localized('order.item'), itemQuantity)}`,
        amount,
    ]);
}

const OrderQuickOverView = ({
    orderId,
    title,
    itemQuantity,
    amount,
    isRightChevronVisible = true,
    titleVariant = 'headlineSmall',
}) => {
    return (
        <Card.Title
            title={title}
            subtitle={formatQuickOrderViewDescription(orderId, itemQuantity, amount)}
            titleVariant={titleVariant}
            titleNumberOfLines={0}
            subtitleNumberOfLines={0}
            right={
                isRightChevronVisible
                    ? () => (
                          <List.Icon style={{ marginRight: MD3LightTheme.spacing.x2 }} icon={MATERIAL_ICONS.chevron} />
                      )
                    : null
            }
        />
    );
};

export default OrderQuickOverView;
