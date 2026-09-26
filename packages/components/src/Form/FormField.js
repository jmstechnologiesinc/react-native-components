import React from 'react';

import { HelperText, TextInput, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';

// C-25 — how a form marks a field the server reports as changed
// (`highlightFields`) or wrong (`errors`). The names are the ones the form
// reports to `inputActionHandler`.

export const isHighlighted = (highlightFields, field) =>
    Array.isArray(highlightFields) && highlightFields.includes(field);

/** The server errors (`{ field, code, message? }`) that belong to one field. */
export const errorsOf = (errors, field) =>
    Array.isArray(errors) && field ? errors.filter((error) => error && error.field === field) : [];

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

/** One error line per server error of `field`. The host resolves the text
 *  (`message`); with only a `code`, the code itself is shown. The form never
 *  validates anything by itself here (K-32). */
export const FieldErrorText = ({ field, errors }) =>
    errorsOf(errors, field).map((error, index) => (
        <HelperText key={`${error.code}.${index}`} type="error" padding="none" visible={true} testID={`error.${field}`}>
            {error.message || error.code}
        </HelperText>
    ));

/** An input of a form that can be highlighted or carry server errors: the
 *  outline in `primary` and the «Changed» line under it; the input's `error`
 *  state and one error line per error of `field`. `input` is the component to
 *  render (a Paper `TextInput` unless told otherwise). */
const FormField = ({ highlighted = false, field, errors, error, input: Input = TextInput, ...props }) => {
    const theme = useTheme();
    const hasServerError = errorsOf(errors, field).length > 0;
    return (
        <>
            <Input
                {...props}
                {...((error || hasServerError) && { error: true })}
                {...(highlighted && {
                    outlineColor: theme.colors.primary,
                    activeOutlineColor: theme.colors.primary,
                })}
            />
            <ChangedHelperText visible={highlighted} />
            <FieldErrorText field={field} errors={errors} />
        </>
    );
};

export default FormField;
