import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider, Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

import * as ActionGroup from '../ActionGroup/ActionGroup';

export const FOOTER_TONES = Object.freeze({ primary: 'primary', danger: 'danger' });

/**
 * @typedef {object} FooterAction
 * @property {string} key
 * @property {string} label
 * @property {string} [icon]
 * @property {() => void} onPress
 * @property {boolean} [primary] the one contained button; when none says so, the last action that is not
 *     `danger` (an adverse action alone stays outlined: it is never the emphasised default)
 * @property {'primary'|'danger'} [tone] `danger` paints the button in the error colour
 * @property {boolean} [disabled]
 */

/**
 * The `ActionGroup.Buttons` entries of a footer's actions: at most one contained button (MD3).
 *
 * @param {FooterAction[]} actions
 * @param {object} colors the theme's colours
 */
export const footerButtons = (actions, colors) => {
    const flagged = actions.findIndex((action) => action.primary);
    const lastSafe = actions.map((action) => action.tone !== FOOTER_TONES.danger).lastIndexOf(true);
    const primaryIndex = flagged >= 0 ? flagged : lastSafe;
    return actions.map((action, index) => {
        const contained = index === primaryIndex;
        const danger = action.tone === FOOTER_TONES.danger;
        return {
            key: action.key,
            title: action.label,
            icon: action.icon,
            isDisabled: action.disabled,
            mode: contained ? 'contained' : 'outlined',
            textColor: danger && !contained ? colors.error : undefined,
            theme: danger && contained ? { colors: { primary: colors.error, onPrimary: colors.onError } } : undefined,
            run: action.onPress,
        };
    });
};

/**
 * The action bar at the bottom of a pane: an optional caption on the leading side and the actions on the
 * trailing side, at most one of them contained. Built on `ActionGroup.Buttons`; `busy` shows every button
 * loading and disabled. The host decides which actions exist; the footer never does. Renders nothing
 * without a caption or actions.
 *
 * @param {{caption?: string, actions?: FooterAction[], busy?: boolean, testID?: string}} props
 */
const PaneFooter = ({ caption, actions = [], busy = false, testID = 'pane-footer' }) => {
    const { colors, spacing } = useTheme();
    if (!caption && !actions.length) return null;

    return (
        <View testID={testID}>
            <Divider />
            <View style={[styles.row, { padding: spacing.x4 }]}>
                {caption ? (
                    <Text variant="bodySmall" style={[styles.caption, { color: colors.onSurfaceVariant }]}>
                        {caption}
                    </Text>
                ) : null}
                <ActionGroup.Buttons
                    buttons={footerButtons(actions, colors)}
                    isLoading={busy}
                    onPress={(button) => button.run?.()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caption: {
        flex: 1,
    },
});

export default PaneFooter;
