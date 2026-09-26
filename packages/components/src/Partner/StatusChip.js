import React from 'react';
import { StyleSheet } from 'react-native';

import { Chip, useTheme } from '@jmstechnologiesinc/react-native-paper';

import { STATUS_TONES, TONE_ICONS, toneColors } from '../tones';
import { statusLabel, statusTone } from './viewModel';

// A chip that SHOWS a status: it is not pressable, so it is announced as text,
// not as a button (Paper's default role for a chip).
const ToneChip = ({ tone, icon, label, compact, testID }) => {
    const theme = useTheme();
    const colors = toneColors(theme, tone);

    return (
        <Chip
            mode="flat"
            compact={compact}
            icon={icon}
            // MD3 Paper paints a chip's icon with `primary`; the tone's own
            // foreground is the only colour that keeps the icon legible on the
            // tone's container.
            theme={{ colors: { primary: colors.onContainer } }}
            selectedColor={colors.onContainer}
            style={[styles.chip, { backgroundColor: colors.container }]}
            accessibilityRole="text"
            accessibilityLabel={label}
            testID={testID}
        >
            {label}
        </Chip>
    );
};

/**
 * The status of a partner entity, labelled and toned by `Partner/viewModel`.
 * `kind`: `partnership | verification | requirement_bucket | screening_report |
 * screening_result | adjudication | task_status`. `label` overrides the
 * catalogue's.
 */
const StatusChip = ({ kind, value, label, compact, testID }) => {
    const tone = statusTone(kind, value);
    return (
        <ToneChip
            tone={tone}
            icon={TONE_ICONS[tone]}
            label={label ?? statusLabel(kind, value)}
            compact={compact}
            testID={testID}
        />
    );
};

const SLA = Object.freeze({
    on_time: { tone: STATUS_TONES.success, icon: 'clock-check-outline' },
    due_soon: { tone: STATUS_TONES.warning, icon: 'clock-outline' },
    overdue: { tone: STATUS_TONES.danger, icon: 'clock-alert-outline' },
});

/**
 * A review task's SLA. The state is computed by the reviewer's console
 * (`slaState`, canon §17.1 rule 3); this only paints it.
 * `state`: `on_time | due_soon | overdue`.
 */
export const SlaChip = ({ state, label, compact, testID }) => {
    const sla = Object.prototype.hasOwnProperty.call(SLA, state)
        ? SLA[state]
        : { tone: STATUS_TONES.neutral, icon: TONE_ICONS[STATUS_TONES.neutral] };
    return <ToneChip tone={sla.tone} icon={sla.icon} label={label} compact={compact} testID={testID} />;
};

const styles = StyleSheet.create({
    chip: {
        alignSelf: 'flex-start',
    },
});

export default StatusChip;
