"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tokens_1 = require("./tokens");
var color_1 = __importDefault(require("color"));
var _a = tokens_1.tokens.md.ref, palette = _a.palette, opacity = _a.opacity;
var LightTheme = {
    dark: false,
    roundness: 4,
    version: 3,
    isV3: true,
    colors: {
        primary: palette.primary40,
        primaryContainer: palette.primary90,
        secondary: palette.secondary40,
        secondaryContainer: palette.secondary90,
        tertiary: palette.tertiary40,
        tertiaryContainer: palette.tertiary90,
        surface: palette.neutral99,
        surfaceVariant: palette.neutralVariant90,
        surfaceDisabled: (0, color_1.default)(palette.neutral10)
            .alpha(opacity.level2)
            .rgb()
            .string(),
        background: palette.neutral99,
        error: palette.error40,
        errorContainer: palette.error90,
        onPrimary: palette.primary100,
        onPrimaryContainer: palette.primary10,
        onSecondary: palette.secondary100,
        onSecondaryContainer: palette.secondary10,
        onTertiary: palette.tertiary100,
        onTertiaryContainer: palette.tertiary10,
        onSurface: palette.neutral10,
        onSurfaceVariant: palette.neutralVariant30,
        onSurfaceDisabled: (0, color_1.default)(palette.neutral10)
            .alpha(opacity.level4)
            .rgb()
            .string(),
        onError: palette.error100,
        onErrorContainer: palette.error10,
        onBackground: palette.neutral10,
        outline: palette.neutralVariant50,
        shadow: palette.neutral0,
        inverseSurface: palette.neutral20,
        inverseOnSurface: palette.neutral95,
        inversePrimary: palette.primary80,
        elevation: {
            level0: 'transparent',
            // Note: Color values with transparency cause RN to transfer shadows to children nodes
            // instead of View component in Surface. Providing solid background fixes the issue.
            // Opaque color values generated with `palette.primary99` used as background
            level1: 'rgb(247, 243, 249)',
            level2: 'rgb(243, 237, 246)',
            level3: 'rgb(238, 232, 244)',
            level4: 'rgb(236, 230, 243)',
            level5: 'rgb(233, 227, 241)', // palette.primary40, alpha 0.14
        },
    },
    typescale: tokens_1.typescale,
    animation: {
        scale: 1.0,
    },
};
exports.default = LightTheme;
