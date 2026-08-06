import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { Button, MD3LightTheme, Menu } from '@jmstechnologiesinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

/**
 * Header of the earnings screen: which period is on screen, and a menu to jump to an earlier one.
 *
 * Every label is formatted by the backend, so this never does date maths — it renders strings and
 * hands a key back.
 */
const EarningsPeriodPicker = ({ periods, selectedKey, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!periods?.length) {
        return null;
    }

    // Falling back to the first period keeps the header labelled while a request is in flight,
    // instead of blinking empty every time the range changes.
    const selected = periods.find((period) => period.key === selectedKey) || periods[0];

    const onPeriodPress = (period) => {
        setIsOpen(false);
        onSelect(period);
    };

    return (
        <View style={styles.header}>
            <Menu
                visible={isOpen}
                onDismiss={() => setIsOpen(false)}
                anchor={
                    <Button
                        mode="text"
                        icon={MATERIAL_ICONS.calendar}
                        onPress={() => setIsOpen(true)}
                        // Paper puts the icon before the label; the affordance belongs after it.
                        contentStyle={styles.anchorContent}
                        accessibilityState={{ expanded: isOpen }}
                    >
                        {selected.label}
                    </Button>
                }
            >
                {periods.map((period) => (
                    <Menu.Item
                        key={period.key}
                        title={period.label}
                        onPress={() => onPeriodPress(period)}
                        titleStyle={period.key === selected.key ? styles.selected : undefined}
                    />
                ))}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
    },
    anchorContent: {
        flexDirection: 'row-reverse',
    },
    selected: {
        color: MD3LightTheme.colors.primary,
    },
});

export default EarningsPeriodPicker;
