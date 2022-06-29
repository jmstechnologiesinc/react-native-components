/// <reference types="react" />
declare const Checkbox: ((props: {
    status: "checked" | "unchecked" | "indeterminate";
    disabled?: boolean | undefined;
    onPress?: (() => void) | undefined;
    uncheckedColor?: string | undefined;
    color?: string | undefined;
    testID?: string | undefined;
}) => JSX.Element) & {
    Item: {
        ({ style, status, label, onPress, labelStyle, testID, mode, position, accessibilityLabel, disabled, labelVariant, ...props }: {
            status: "checked" | "unchecked" | "indeterminate";
            disabled?: boolean | undefined;
            label: string;
            onPress?: (() => void) | undefined;
            accessibilityLabel?: string | undefined;
            uncheckedColor?: string | undefined;
            color?: string | undefined;
            style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
            labelStyle?: import("react-native").StyleProp<import("react-native").TextStyle>;
            labelVariant?: "displayLarge" | "displayMedium" | "displaySmall" | "headlineLarge" | "headlineMedium" | "headlineSmall" | "titleLarge" | "titleMedium" | "titleSmall" | "labelLarge" | "labelMedium" | "labelSmall" | "bodyLarge" | "bodyMedium" | "bodySmall" | undefined;
            testID?: string | undefined;
            position?: "leading" | "trailing" | undefined;
            mode?: "ios" | "android" | undefined;
        }): JSX.Element;
        displayName: string;
    };
    Android: {
        ({ status, disabled, onPress, testID, ...rest }: import("./types").$RemoveChildren<{
            ({ style, background: _background, borderless, disabled: disabledProp, rippleColor, underlayColor: _underlayColor, children, ...rest }: import("react-native").TouchableWithoutFeedbackProps & import("react").RefAttributes<import("react-native").TouchableWithoutFeedback> & {
                borderless?: boolean | undefined;
                background?: Object | undefined;
                centered?: boolean | undefined;
                disabled?: boolean | undefined;
                onPress?: ((e: import("react-native").GestureResponderEvent) => void) | undefined;
                onLongPress?: ((e: import("react-native").GestureResponderEvent) => void) | undefined;
                rippleColor?: string | undefined;
                underlayColor?: string | undefined;
                children: import("react").ReactNode;
                style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
            }): JSX.Element;
            supported: boolean;
        }> & {
            status: "checked" | "unchecked" | "indeterminate";
            disabled?: boolean | undefined;
            onPress?: (() => void) | undefined;
            uncheckedColor?: string | undefined;
            color?: string | undefined;
            testID?: string | undefined;
        }): JSX.Element;
        displayName: string;
    };
    IOS: {
        ({ status, disabled, onPress, testID, ...rest }: import("./types").$RemoveChildren<{
            ({ style, background: _background, borderless, disabled: disabledProp, rippleColor, underlayColor: _underlayColor, children, ...rest }: import("react-native").TouchableWithoutFeedbackProps & import("react").RefAttributes<import("react-native").TouchableWithoutFeedback> & {
                borderless?: boolean | undefined;
                background?: Object | undefined;
                centered?: boolean | undefined;
                disabled?: boolean | undefined;
                onPress?: ((e: import("react-native").GestureResponderEvent) => void) | undefined;
                onLongPress?: ((e: import("react-native").GestureResponderEvent) => void) | undefined;
                rippleColor?: string | undefined;
                underlayColor?: string | undefined;
                children: import("react").ReactNode;
                style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
            }): JSX.Element;
            supported: boolean;
        }> & {
            status: "checked" | "unchecked" | "indeterminate";
            disabled?: boolean | undefined;
            onPress?: (() => void) | undefined;
            color?: string | undefined;
            testID?: string | undefined;
        }): JSX.Element;
        displayName: string;
    };
};
export default Checkbox;
