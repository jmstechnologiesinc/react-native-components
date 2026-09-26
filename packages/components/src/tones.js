import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

// The five tones a status can take, and the theme roles each one paints with.
//
// MD3 has no success or warning roles, so they borrow the tertiary and
// secondary containers — unless the host's theme declares its own
// (`successContainer`, `warningContainer`, …), which then wins. Because those
// borrowed roles can sit close to each other in a warm palette, every tone also
// carries an ICON: the meaning of a status never rests on colour alone.

export const STATUS_TONES = Object.freeze({
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    neutral: 'neutral',
    info: 'info',
});

export const TONE_ICONS = Object.freeze({
    [STATUS_TONES.success]: 'check-circle-outline',
    [STATUS_TONES.warning]: MATERIAL_ICONS.alert,
    [STATUS_TONES.danger]: 'close-circle-outline',
    [STATUS_TONES.neutral]: 'circle-outline',
    [STATUS_TONES.info]: 'information-outline',
});

/** `{ container, onContainer, accent }` for a tone, read from the theme in use.
 *  An unknown tone is painted as `neutral`. */
export const toneColors = (theme, tone) => {
    const { colors } = theme;

    switch (tone) {
        case STATUS_TONES.success:
            return {
                container: colors.successContainer ?? colors.tertiaryContainer,
                onContainer: colors.onSuccessContainer ?? colors.onTertiaryContainer,
                accent: colors.success ?? colors.tertiary,
            };
        case STATUS_TONES.warning:
            return {
                container: colors.warningContainer ?? colors.secondaryContainer,
                onContainer: colors.onWarningContainer ?? colors.onSecondaryContainer,
                accent: colors.warning ?? colors.secondary,
            };
        case STATUS_TONES.danger:
            return { container: colors.errorContainer, onContainer: colors.onErrorContainer, accent: colors.error };
        case STATUS_TONES.info:
            return {
                container: colors.primaryContainer,
                onContainer: colors.onPrimaryContainer,
                accent: colors.primary,
            };
        default:
            return { container: colors.surfaceVariant, onContainer: colors.onSurfaceVariant, accent: colors.outline };
    }
};
