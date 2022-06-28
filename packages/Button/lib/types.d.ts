import type * as React from 'react';
export declare type Font = {
    fontFamily: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
};
export declare type Fonts = {
    regular: Font;
    medium: Font;
    light: Font;
    thin: Font;
};
declare type Mode = 'adaptive' | 'exact';
export declare type MD2Colors = {
    primary: string;
    background: string;
    surface: string;
    accent: string;
    error: string;
    text: string;
    onSurface: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    notification: string;
};
export declare type MD3Colors = {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    surface: string;
    surfaceVariant: string;
    surfaceDisabled: string;
    background: string;
    error: string;
    errorContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    onSurface: string;
    onSurfaceVariant: string;
    onSurfaceDisabled: string;
    onError: string;
    onErrorContainer: string;
    onBackground: string;
    outline: string;
    shadow: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    elevation: MD3ElevationColors;
};
export declare type MD3Palette = {};
export declare type ThemeProp = {};
export declare type ThemeBase = {
    dark: boolean;
    mode?: Mode;
    roundness: number;
    animation: {
        scale: number;
    };
} & ({
    version: 2;
    colors: MD2Colors;
    isV3: false;
    fonts: Fonts;
} | {
    version: 3;
    colors: MD3Colors;
    isV3: true;
    typescale: MD3Typescale;
});
export declare type Theme = ThemeBase;
export declare enum MD3TypescaleKey {
    displayLarge = "displayLarge",
    displayMedium = "displayMedium",
    displaySmall = "displaySmall",
    headlineLarge = "headlineLarge",
    headlineMedium = "headlineMedium",
    headlineSmall = "headlineSmall",
    titleLarge = "titleLarge",
    titleMedium = "titleMedium",
    titleSmall = "titleSmall",
    labelLarge = "labelLarge",
    labelMedium = "labelMedium",
    labelSmall = "labelSmall",
    bodyLarge = "bodyLarge",
    bodyMedium = "bodyMedium",
    bodySmall = "bodySmall"
}
export declare type MD3Type = {
    fontFamily: string;
    letterSpacing: number;
    fontWeight: Font['fontWeight'];
    lineHeight: number;
    fontSize: number;
};
export declare type MD3Typescale = {
    [key in MD3TypescaleKey]: MD3Type;
};
export declare type MD3Tokens = {
    md: {
        sys: {
            color: MD3Colors;
            typescale: MD3Typescale;
        };
        ref: {
            palette: MD3Palette;
            typeface: {
                brandRegular: Font['fontFamily'];
                weightRegular: Font['fontWeight'];
                plainMedium: Font['fontFamily'];
                weightMedium: Font['fontWeight'];
            };
            opacity: {
                level1: number;
                level2: number;
                level3: number;
                level4: number;
            };
        };
    };
};
export declare type MD3Elevation = 0 | 1 | 2 | 3 | 4 | 5;
export declare enum ElevationLevels {
    'level0' = 0,
    'level1' = 1,
    'level2' = 2,
    'level3' = 3,
    'level4' = 4,
    'level5' = 5
}
export declare type MD3ElevationColors = {
    [key in keyof typeof ElevationLevels]: string;
};
export declare type $Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type $RemoveChildren<T extends React.ComponentType<any>> = $Omit<React.ComponentPropsWithoutRef<T>, 'children'>;
export declare type EllipsizeProp = 'head' | 'middle' | 'tail' | 'clip';
declare global {
    namespace ReactNativePaper {
        interface ThemeFont {
            fontFamily: string;
            fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
        }
        interface ThemeFonts {
            regular: ThemeFont;
            medium: ThemeFont;
            light: ThemeFont;
            thin: ThemeFont;
        }
        interface ThemeColors {
            primary: string;
            background: string;
            surface: string;
            accent: string;
            error: string;
            text: string;
            onSurface: string;
            disabled: string;
            placeholder: string;
            backdrop: string;
            notification: string;
        }
        interface ThemeAnimation {
            scale: number;
        }
    }
}
export {};
