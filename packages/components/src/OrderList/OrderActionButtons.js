import React from 'react';

import { Card, Button } from '@jmsstudiosinc/react-native-paper';

export const ORDER_ACTIONS = {
    print: 'print',
    call: 'call',
};

const OrderActionButtons = ({ 
    orderID,
    buttons,
    onPress,
}) => buttons?.length > 0 ? (
    <Card.Actions>
        {buttons.map((button) => (
            <Button
                onPress={() => onPress?.(button, orderID)}
                {...(button.value === ORDER_ACTIONS.print && { icon: 'printer' })}>
                {button.label}
            </Button>
        ))}
    </Card.Actions>
) : null

export default OrderActionButtons;
