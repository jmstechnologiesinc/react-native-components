import React, { useState } from 'react';

import { FlatList, Pressable, View } from 'react-native';

import {
    TextInput,
    List,
    IconButton,
    Button,
    Dialog,
    Portal,
    HelperText,
    Text,
    TouchableRipple,
    useTheme,
    MD3LightTheme,
} from '@jmstechnologiesinc/react-native-paper';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

import { localized } from '../Localization/Localization';

import {
    DAYS_OF_WEEK,
    isRangeInvalid,
    rangesOf,
    timeSlotsFor,
    withRangeAdded,
    withRangeRemoved,
    withRangeUpdated,
} from './utils';

// Fixed row height: it is what makes `getItemLayout` exact and lets the list open already
// scrolled to the selected hour, without walking 96 rows to measure them.
const SLOT_HEIGHT = 48;
const VISIBLE_SLOTS = 7;

// Paper paints the list instead of each platform's native picker. It is the only way to make
// Android and iOS look the same and follow the app theme: Android's native dialog lives outside
// the React tree and can only be themed through XML.
const TimeField = ({ label, value, error, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();

    const slots = timeSlotsFor(value);
    const selectedIndex = slots.indexOf(value);

    const renderSlot = ({ item }) => {
        const isSelected = item === value;

        return (
            <TouchableRipple
                onPress={() => {
                    onChange(item);
                    setIsOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
            >
                <View
                    style={{
                        height: SLOT_HEIGHT,
                        justifyContent: 'center',
                        paddingHorizontal: MD3LightTheme.spacing.x3,
                        backgroundColor: isSelected ? theme.colors.secondaryContainer : 'transparent',
                    }}
                >
                    <Text
                        variant="bodyLarge"
                        style={{ color: isSelected ? theme.colors.onSecondaryContainer : theme.colors.onSurface }}
                    >
                        {item}
                    </Text>
                </View>
            </TouchableRipple>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {/* The TextInput is not editable, it only shows the value: the touch is taken by the
                Pressable, which is the only thing that opens the dialog. */}
            <Pressable onPress={() => setIsOpen(true)}>
                <View pointerEvents="none">
                    <TextInput
                        mode="outlined"
                        dense
                        error={error}
                        label={label}
                        value={value}
                        editable={false}
                        right={<TextInput.Icon icon="clock-outline" />}
                    />
                </View>
            </Pressable>

            <Portal>
                <Dialog visible={isOpen} onDismiss={() => setIsOpen(false)}>
                    <Dialog.Title>{label}</Dialog.Title>

                    <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                        <FlatList
                            data={slots}
                            keyExtractor={(slot) => slot}
                            renderItem={renderSlot}
                            style={{ maxHeight: SLOT_HEIGHT * VISIBLE_SLOTS }}
                            getItemLayout={(_data, index) => ({
                                length: SLOT_HEIGHT,
                                offset: SLOT_HEIGHT * index,
                                index,
                            })}
                            // Leaves the selection a third down the list instead of stuck to the
                            // top, so it is visible that there are earlier hours.
                            initialScrollIndex={Math.max(0, selectedIndex - 2)}
                        />
                    </Dialog.ScrollArea>

                    <Dialog.Actions>
                        <Button onPress={() => setIsOpen(false)}>{localized('cancel')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

// Editor of a menu's weekly schedule. The state lives above (the consuming screen); here we only
// paint and report changes with the whole updated map.
const MenuScheduleForm = ({ schedule, onChange }) => {
    const renderRange = (day) => (range, index) => {
        const hasError = isRangeInvalid(schedule, day, index);

        return (
            <View key={`${day}-${index}`}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TimeField
                        label={localized('startTime')}
                        value={range.startTime}
                        error={hasError}
                        onChange={(value) => onChange(withRangeUpdated(schedule, day, index, 'startTime', value))}
                    />

                    <View style={{ width: MD3LightTheme.spacing.x2 }} />

                    <TimeField
                        label={localized('endTime')}
                        value={range.endTime}
                        error={hasError}
                        onChange={(value) => onChange(withRangeUpdated(schedule, day, index, 'endTime', value))}
                    />

                    <IconButton
                        icon={MATERIAL_ICONS.remove}
                        accessibilityLabel={localized('remove')}
                        onPress={() => onChange(withRangeRemoved(schedule, day, index))}
                    />
                </View>
                {hasError ? <HelperText type="error">{localized('menuHoursInvalid')}</HelperText> : null}
            </View>
        );
    };

    return (
        <View>
            {DAYS_OF_WEEK.map((day) => {
                const ranges = rangesOf(schedule, day);

                return (
                    <View key={day} style={{ marginBottom: MD3LightTheme.spacing.x2 }}>
                        <List.Subheader>{localized(day)}</List.Subheader>

                        {ranges.length === 0 ? (
                            <HelperText style={{ marginTop: -MD3LightTheme.spacing.x2 }}>
                                {localized('menuClosed')}
                            </HelperText>
                        ) : (
                            ranges.map(renderRange(day))
                        )}

                        <Button
                            icon={MATERIAL_ICONS.add}
                            onPress={() => onChange(withRangeAdded(schedule, day))}
                            style={{ alignSelf: 'flex-start' }}
                        >
                            {localized('menuAddHours')}
                        </Button>
                    </View>
                );
            })}

            <HelperText>{localized('menuHoursFormatHelp')}</HelperText>
        </View>
    );
};

export default MenuScheduleForm;
