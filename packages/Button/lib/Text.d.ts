import * as React from 'react';
import { TextStyle, StyleProp } from 'react-native';
declare const _default: React.ForwardRefExoticComponent<import("react-native").TextProps & {
    /**
     * @supported Available in v5.x with theme version 3
     *
     * Variant defines appropriate text styles for type role and its size.
     * Available variants:
     *
     *  Display: `displayLarge`, `displayMedium`, `displaySmall`
     *
     *  Headline: `headlineLarge`, `headlineMedium`, `headlineSmall`
     *
     *  Title: `titleLarge`, `titleMedium`, `titleSmall`
     *
     *  Label:  `labelLarge`, `labelMedium`, `labelSmall`
     *
     *  Body: `bodyLarge`, `bodyMedium`, `bodySmall`
     */
    variant?: "displayLarge" | "displayMedium" | "displaySmall" | "headlineLarge" | "headlineMedium" | "headlineSmall" | "titleLarge" | "titleMedium" | "titleSmall" | "labelLarge" | "labelMedium" | "labelSmall" | "bodyLarge" | "bodyMedium" | "bodySmall" | undefined;
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
} & React.RefAttributes<{}>>;
export default _default;
