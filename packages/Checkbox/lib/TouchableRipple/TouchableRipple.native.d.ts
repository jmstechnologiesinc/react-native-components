import * as React from 'react';
import { BackgroundPropType, StyleProp, TouchableWithoutFeedback, ViewStyle } from 'react-native';
declare type Props = React.ComponentProps<typeof TouchableWithoutFeedback> & {
    borderless?: boolean;
    background?: BackgroundPropType;
    disabled?: boolean;
    onPress?: () => void | null;
    rippleColor?: string;
    underlayColor?: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};
declare const TouchableRipple: {
    ({ style, background, borderless, disabled: disabledProp, rippleColor, underlayColor, children, ...rest }: Props): JSX.Element;
    supported: boolean;
};
export default TouchableRipple;
