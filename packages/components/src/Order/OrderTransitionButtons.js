import React from 'react';

import { MD3Colors } from '@jmstechnologiesinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';
import { ORDER_ACTIONS, ORDER_STATUS_CANCELLED } from '@jmstechnologiesinc/order';
import { ActionGroup, ScreenWrapper } from '@jmstechnologiesinc/react-native-components';

const OrderTransitionButtons = ({ buttons = [], onPress }) => {
    const buttonsMapping = buttons?.map((button) => {
        if (ORDER_STATUS_CANCELLED(button.value)) {
            return {
                ...button,
                mode: 'text',
                compact: true,
                textColor: MD3Colors.error50,
                contentStyle: { flexGrow: 2 },
            };
        } else if (button.value === ORDER_ACTIONS.print) {
            return {
                ...button,
                icon: MATERIAL_ICONS.printer,
                mode: 'text',
                contentStyle: { flexGrow: 2 },
            };
        }

        return {
            ...button,
            compact: false,
            contentStyle: { flexGrow: 3 },
        };
    });
    console.log(JSON.stringify(buttonsMapping, null, 2));

    return buttonsMapping?.length > 0 ? (
        <ScreenWrapper.Container>
            <ScreenWrapper.Section>
                <ActionGroup.Group>
                    <ActionGroup.Buttons buttons={buttonsMapping} onPress={(button) => onPress(button)} />
                </ActionGroup.Group>
            </ScreenWrapper.Section>
        </ScreenWrapper.Container>
    ) : null;
};

export default OrderTransitionButtons;
