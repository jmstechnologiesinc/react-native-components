import React, { useId, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import {
    Button,
    Dialog,
    HelperText,
    Portal,
    RadioButton,
    Text,
    TextInput,
    useTheme,
} from '@jmstechnologiesinc/react-native-paper';

import { isWeb } from '../accessibility';
import { localized } from '../Localization/Localization';
import { useModalFocus } from '../useModalFocus';

export const CONFIRM_TONES = Object.freeze({ primary: 'primary', danger: 'danger' });

// MD3 caps a basic dialog at 560dp. Only a window wide enough to leave room
// around it gets the cap: on a phone the dialog keeps Paper's own margins, so
// the mobile layout is unchanged.
const MAX_DIALOG_WIDTH = 560;

const isBlank = (value) => !value || !String(value).trim();

// A choice of `0` or `false` is a choice.
const isUnset = (value) => value === undefined || value === null || value === '';

/**
 * A decision confirmed in a dialog: an optional choice among `options` (a
 * reason, say), an optional note, and a confirm button whose tone says whether
 * the decision is adverse (`danger`).
 *
 * The dialog decides nothing (K-32): which options exist, whether the note is
 * required and the error to show come from the host, which has them from the
 * server. Disabling confirm while a required choice or note is empty is a UX
 * courtesy; the server still refuses (`note_required`) and the host shows that
 * in `note.error`.
 *
 * `busy` locks the dialog while the command is in flight: it cannot be
 * dismissed, and confirm shows its progress.
 *
 * On the web it is a real modal dialog (WAI-ARIA): `role="dialog"`,
 * `aria-modal` and `aria-labelledby` its title; focus moves into it when it
 * opens, Tab stays inside, Esc dismisses it unless `busy`, and focus returns
 * to what opened it (`useModalFocus`). Native renders exactly as before.
 */
const DecisionDialog = ({
    visible,
    title,
    description,
    options,
    selectedOption,
    onSelectOption,
    note,
    summary,
    confirmLabel,
    confirmTone = CONFIRM_TONES.primary,
    busy = false,
    onConfirm,
    onDismiss,
    children,
    testID,
}) => {
    const theme = useTheme();
    const { width: windowWidth } = useWindowDimensions();
    const isWide = windowWidth > MAX_DIALOG_WIDTH + 2 * theme.spacing.x12;
    // Uncontrolled when the host passes no `onSelectOption`: Paper's
    // RadioButton.Group throws on press without a handler.
    const [ownOption, setOwnOption] = useState(selectedOption);
    const isControlled = typeof onSelectOption === 'function';
    const currentOption = isControlled ? selectedOption : ownOption;
    const selectOption = isControlled ? onSelectOption : setOwnOption;
    const hasOptions = Array.isArray(options) && options.length > 0;
    const isDanger = confirmTone === CONFIRM_TONES.danger;
    const missingChoice = hasOptions && isUnset(currentOption);
    const missingNote = Boolean(note?.required) && isBlank(note?.value);
    const web = isWeb();
    const titleId = `decision-dialog-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`;
    const dismiss = busy ? undefined : onDismiss;
    const frameRef = useModalFocus({ visible: Boolean(visible) && web, onDismiss: dismiss });

    const content = [
        <Dialog.Title key="title" nativeID={web ? titleId : undefined} testID={testID ? `${testID}-title` : undefined}>
            {title}
        </Dialog.Title>,
        <Dialog.ScrollArea key="body" style={styles.scrollArea}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: theme.spacing.x6 }}>
                {description ? (
                    <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant, marginBottom: theme.spacing.x4 }}
                    >
                        {description}
                    </Text>
                ) : null}

                {hasOptions ? (
                    <RadioButton.Group value={currentOption} onValueChange={selectOption}>
                        {options.map((option) => (
                            <React.Fragment key={option.value}>
                                <RadioButton.Item
                                    mode="android"
                                    position="leading"
                                    label={option.label}
                                    value={option.value}
                                    disabled={busy}
                                    accessibilityLabel={
                                        option.description ? `${option.label}, ${option.description}` : option.label
                                    }
                                    labelStyle={styles.optionLabel}
                                    style={styles.option}
                                    testID={testID ? `${testID}-option-${option.value}` : undefined}
                                />
                                {option.description ? (
                                    <Text
                                        variant="bodySmall"
                                        style={{
                                            color: theme.colors.onSurfaceVariant,
                                            paddingLeft: theme.spacing.x12,
                                            marginBottom: theme.spacing.x2,
                                        }}
                                    >
                                        {option.description}
                                    </Text>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </RadioButton.Group>
                ) : null}

                {note ? (
                    <>
                        <TextInput
                            mode="outlined"
                            multiline
                            label={note.label}
                            value={note.value}
                            onChangeText={note.onChangeText}
                            error={Boolean(note.error)}
                            disabled={busy}
                            accessibilityLabel={note.label}
                            style={{ marginTop: theme.spacing.x2 }}
                            testID={testID ? `${testID}-note` : undefined}
                        />
                        <HelperText
                            type={note.error ? 'error' : 'info'}
                            visible={Boolean(note.error || note.required)}
                            padding="none"
                        >
                            {note.error || localized('global.required')}
                        </HelperText>
                    </>
                ) : null}

                {typeof summary === 'string' ? <Text variant="bodyMedium">{summary}</Text> : summary}

                {children}
            </ScrollView>
        </Dialog.ScrollArea>,
        <Dialog.Actions key="actions">
            <Button onPress={onDismiss} disabled={busy} testID={testID ? `${testID}-cancel` : undefined}>
                {localized('global.cancel')}
            </Button>
            <Button
                mode="contained"
                buttonColor={isDanger ? theme.colors.error : undefined}
                textColor={isDanger ? theme.colors.onError : undefined}
                loading={busy}
                disabled={busy || missingChoice || missingNote}
                onPress={() => onConfirm?.(currentOption)}
                testID={testID ? `${testID}-confirm` : undefined}
            >
                {confirmLabel}
            </Button>
        </Dialog.Actions>,
    ];

    return (
        <Portal>
            <Dialog visible={visible} dismissable={!busy} onDismiss={dismiss} style={isWide ? styles.wideDialog : null}>
                {web ? (
                    <View
                        ref={frameRef}
                        role="dialog"
                        aria-modal
                        aria-labelledby={titleId}
                        style={styles.webFrame}
                        testID={testID ? `${testID}-frame` : undefined}
                    >
                        {content}
                    </View>
                ) : (
                    content
                )}
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    // The web frame sits between Paper's Dialog and its sections: it must
    // shrink like them so a long dialog still scrolls in its ScrollArea.
    webFrame: {
        flexShrink: 1,
        minHeight: 0,
    },
    wideDialog: {
        alignSelf: 'center',
        width: MAX_DIALOG_WIDTH,
    },
    scrollArea: {
        paddingHorizontal: 0,
    },
    option: {
        paddingHorizontal: 0,
    },
    optionLabel: {
        textAlign: 'left',
    },
});

export default DecisionDialog;
