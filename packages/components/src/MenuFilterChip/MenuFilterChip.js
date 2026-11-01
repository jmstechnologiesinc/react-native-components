import React, { useState } from 'react';

import { Chip, Menu } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

/**
 * @typedef {object} MenuFilterOption
 * @property {string} value
 * @property {string} label as shown, localized by the host
 */

/**
 * One MD3 filter chip whose single choice opens in a Paper `Menu` (MD3: a filter chip's trailing icon "can be
 * used to open a menu"), for a dimension of a collection with too many values to stand as a chip each (a
 * status, a jurisdiction). The chip is drawn as `ChipList` draws one (outlined, selected overlay): Paper's
 * defaults, nothing added.
 *
 * - Unfiltered (`value` null or undefined) the chip names the dimension (`label`); filtered it is selected and
 *   reads `<label>: <option>`, so the active filter shows without opening it.
 * - The menu lists `clearLabel` first when given ("Any status", reports `null`), then the options; the current
 *   one carries a check. Choosing closes the menu; choosing the current one reports nothing.
 * - The chip opens the menu, and so does its trailing arrow (Paper's one trailing slot is `closeIcon`/`onClose`).
 *
 * @param {{label: string, options: MenuFilterOption[], value?: ?string, onChange: (value: ?string) => void,
 *     clearLabel?: string, disabled?: boolean, testID?: string}} props testIDs `<testID>` (the chip),
 *     `<testID>.clear`, `<testID>.<value>`; default `menu-filter-chip`
 */
const MenuFilterChip = ({
    label,
    options,
    value,
    onChange,
    clearLabel,
    disabled = false,
    testID = 'menu-filter-chip',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const current = value === null || value === undefined ? null : options.find((option) => option.value === value);
    const text = current ? localized('global.filterValue', { label, value: current.label }) : label;
    const open = () => setIsOpen(true);

    const choose = (next) => {
        setIsOpen(false);
        if (next !== (current ? current.value : null)) onChange(next);
    };

    return (
        <Menu
            visible={isOpen && !disabled}
            onDismiss={() => setIsOpen(false)}
            anchor={
                <Chip
                    mode="outlined"
                    selected={Boolean(current)}
                    showSelectedOverlay
                    disabled={disabled}
                    onPress={open}
                    closeIcon="menu-down"
                    onClose={disabled ? undefined : open}
                    closeIconAccessibilityLabel={localized('global.chooseFilter', { label })}
                    accessibilityLabel={text}
                    accessibilityState={{ selected: Boolean(current), expanded: isOpen, disabled }}
                    testID={testID}
                >
                    {text}
                </Chip>
            }
        >
            {clearLabel ? (
                <Menu.Item
                    title={clearLabel}
                    leadingIcon={current ? undefined : 'check'}
                    onPress={() => choose(null)}
                    testID={`${testID}.clear`}
                />
            ) : null}
            {options.map((option) => (
                <Menu.Item
                    key={option.value}
                    title={option.label}
                    leadingIcon={current && current.value === option.value ? 'check' : undefined}
                    onPress={() => choose(option.value)}
                    testID={`${testID}.${option.value}`}
                />
            ))}
        </Menu>
    );
};

export default MenuFilterChip;
