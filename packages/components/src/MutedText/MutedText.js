import React from 'react';

import { Text, useTheme } from '@jmstechnologiesinc/react-native-paper';

/**
 * Secondary body text in `onSurfaceVariant`: an empty section's line («No open tasks»), a hint.
 *
 * @param {{children?: React.ReactNode, variant?: string, numberOfLines?: number, style?: any,
 *     testID?: string}} props `variant` is an MD3 type role (default `bodyMedium`)
 */
const MutedText = ({ children, variant = 'bodyMedium', numberOfLines, style, testID }) => {
    const { colors } = useTheme();
    return (
        <Text
            variant={variant}
            numberOfLines={numberOfLines}
            style={[{ color: colors.onSurfaceVariant }, style]}
            testID={testID}
        >
            {children}
        </Text>
    );
};

export default MutedText;
