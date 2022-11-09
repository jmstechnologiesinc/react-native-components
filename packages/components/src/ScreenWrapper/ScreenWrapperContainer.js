import * as React from 'react';
import { View } from 'react-native';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const containerPaddings = {
    top: MD3LightTheme.spacing.x2,
    bottom: MD3LightTheme.spacing.x4,
    left: MD3LightTheme.spacing.x4,
    right: MD3LightTheme.spacing.x4,
};

export const ScreenWrapperContainer = ({
    withPaddingVertical = true,
    withPaddingHorizontal = true,
    paddingTop = containerPaddings.top,
    paddingBottom = containerPaddings.bottom,
    paddingLeft = containerPaddings.left,
    paddingRight = containerPaddings.right,
    style,
    children,
}) => (
    <View
        style={[
            {
                ...(withPaddingVertical && { paddingTop, paddingBottom }),
                ...(withPaddingHorizontal && { paddingLeft, paddingRight }),
            },
            style,
        ]}
    >
        {children}
    </View>
);

export { containerPaddings };

export default ScreenWrapperContainer;
