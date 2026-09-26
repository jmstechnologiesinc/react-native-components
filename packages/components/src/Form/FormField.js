import React from 'react';

import { HelperText, TextInput, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

// C-25 — how a form marks a field the server reports as changed
// (`highlightFields`). The names are the ones the form reports to
// `inputActionHandler`.

export const isHighlighted = (highlightFields, field) =>
    Array.isArray(highlightFields) && highlightFields.includes(field);

/** «Changed», under a highlighted field. Paper ignores a custom outline on a
 *  disabled input, so on a read-only form this line is the marker that
 *  remains; it is never greyed out. */
export const ChangedHelperText = ({ visible }) => {
    const theme = useTheme();
    return visible ? (
        <HelperText type="info" padding="none" style={{ color: theme.colors.primary }}>
            {localized('global.changed')}
        </HelperText>
    ) : null;
};

/** An input of a form that can be highlighted: the outline in `primary`, and
 *  the «Changed» line under it. `input` is the component to render (a Paper
 *  `TextInput` unless told otherwise). */
const FormField = ({ highlighted = false, input: Input = TextInput, ...props }) => {
    const theme = useTheme();
    return (
        <>
            <Input
                {...props}
                {...(highlighted && {
                    outlineColor: theme.colors.primary,
                    activeOutlineColor: theme.colors.primary,
                })}
            />
            <ChangedHelperText visible={highlighted} />
        </>
    );
};

export default FormField;
