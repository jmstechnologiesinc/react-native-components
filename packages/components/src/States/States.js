import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@jmstechnologiesinc/react-native-paper';

import { localized } from '../Localization/Localization';
import TNActivityIndicator from '../truly-native/TNActivityIndicator';
import TNEmptyStateView from '../truly-native/TNEmptyStateView';

// The three states a pane's content can be in besides «loaded», on the
// library's `TNEmptyStateView` and `TNActivityIndicator`. Each fills its pane.

/**
 * Nothing to show, with the next thing to do: a title, a description and, with `onAction`, an outlined
 * button.
 *
 * @param {{title: string, description?: string, actionLabel?: string, actionIcon?: string,
 *     onAction?: () => void, testID?: string}} props testID default `empty-state`
 */
export const EmptyState = ({ title, description, actionLabel, actionIcon, onAction, testID = 'empty-state' }) => {
    const { spacing } = useTheme();
    return (
        <View style={[styles.fill, { padding: spacing.x6 }]} testID={testID}>
            <TNEmptyStateView
                titleVariant="titleMedium"
                bodyVariant="bodyMedium"
                buttonMode="outlined"
                emptyStateConfig={{
                    title,
                    description,
                    buttonName: onAction ? actionLabel : undefined,
                    buttonIcon: actionIcon,
                    onPress: onAction,
                }}
            />
        </View>
    );
};

/**
 * A spinner inside the pane (no skeletons), a `progressbar` named `label`.
 *
 * @param {{label?: string, testID?: string}} props `label` defaults to `global.loading`; testID default
 *     `loading-state`
 */
export const LoadingState = ({ label, testID = 'loading-state' }) => (
    <View
        style={styles.fill}
        role="progressbar"
        aria-busy
        aria-label={label ?? localized('global.loading')}
        testID={testID}
    >
        <TNActivityIndicator />
    </View>
);

/**
 * A failure (a transport error, a refused read), announced (`alert`), with a retry button when the host can
 * retry.
 *
 * @param {{title?: string, description?: string, onRetry?: () => void, retryLabel?: string,
 *     testID?: string}} props `title` defaults to `global.somethingWentWrong`, `retryLabel` to
 *     `global.retry`; testID default `error-state`
 */
export const ErrorState = ({ title, description, onRetry, retryLabel, testID = 'error-state' }) => {
    const { spacing } = useTheme();
    return (
        <View style={[styles.fill, { padding: spacing.x6 }]} role="alert" testID={testID}>
            <TNEmptyStateView
                titleVariant="titleMedium"
                bodyVariant="bodyMedium"
                buttonMode="outlined"
                emptyStateConfig={{
                    title: title ?? localized('global.somethingWentWrong'),
                    description,
                    buttonName: onRetry ? retryLabel ?? localized('global.retry') : undefined,
                    buttonIcon: 'refresh',
                    onPress: onRetry,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
});
