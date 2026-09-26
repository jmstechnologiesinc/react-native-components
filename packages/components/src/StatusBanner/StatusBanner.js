import React, { useMemo } from 'react';

import { Banner, ThemeProvider, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { STATUS_TONES, TONE_ICONS, toneColors } from '../tones';

/**
 * A prominent message with its actions, toned like a status: Paper `Banner` painted with a tone's
 * container (`tones.js`: success, warning, danger, neutral, info; the host theme's
 * `success`/`warning` roles when it declares them). The message, the tone's icon and the actions are
 * drawn in the tone's `onContainer` colour. The icon defaults to the tone's (`TONE_ICONS`), so the meaning
 * never rests on colour alone. Paper announces the message (`alert`, polite live region) and animates it
 * in and out with `visible`.
 *
 * @param {{message: React.ReactNode, tone?: string, icon?: string|null, actions?: Array<{label: string,
 *     onPress: () => void, disabled?: boolean}>, visible?: boolean, style?: any, testID?: string}} props
 *     `tone` defaults to `info`; `icon={null}` draws none
 */
const StatusBanner = ({ message, tone = STATUS_TONES.info, icon, actions = [], visible = true, style, testID }) => {
    const theme = useTheme();
    const colors = toneColors(theme, tone);
    // The Banner paints its text with `onSurface`, its actions with `primary` and its icon from the theme
    // in context: the tone's foreground replaces all three.
    const toned = useMemo(
        () => ({
            ...theme,
            colors: { ...theme.colors, onSurface: colors.onContainer, primary: colors.onContainer },
        }),
        [theme, colors.onContainer]
    );
    const iconSource = icon === undefined ? TONE_ICONS[tone] ?? TONE_ICONS[STATUS_TONES.neutral] : icon;

    return (
        <ThemeProvider theme={toned}>
            <Banner
                visible={visible}
                icon={iconSource ?? undefined}
                actions={actions}
                style={[{ backgroundColor: colors.container }, style]}
                elevation={0}
                testID={testID}
            >
                {message}
            </Banner>
        </ThemeProvider>
    );
};

export default StatusBanner;
