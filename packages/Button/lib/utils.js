"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getButtonColors = void 0;
var react_native_1 = require("react-native");
var color_1 = __importDefault(require("color"));
var colors_1 = require("./colors");
var LightTheme_1 = __importDefault(require("./LightTheme"));
var isDark = function (_a) {
    var dark = _a.dark, backgroundColor = _a.backgroundColor;
    if (typeof dark === 'boolean') {
        return dark;
    }
    if (backgroundColor === 'transparent') {
        return false;
    }
    if (backgroundColor !== 'transparent') {
        return !(0, color_1.default)(backgroundColor).isLight();
    }
    return false;
};
var getButtonBackgroundColor = function (_a) {
    var isMode = _a.isMode, disabled = _a.disabled, customButtonColor = _a.customButtonColor;
    if (customButtonColor && !disabled) {
        return customButtonColor;
    }
    if (LightTheme_1.default.isV3) {
        if (disabled) {
            if (isMode('outlined') || isMode('text')) {
                return 'transparent';
            }
            return LightTheme_1.default.colors.surfaceDisabled;
        }
        if (isMode('elevated')) {
            return LightTheme_1.default.colors.elevation.level1;
        }
        if (isMode('contained')) {
            return LightTheme_1.default.colors.primary;
        }
        if (isMode('contained-tonal')) {
            return LightTheme_1.default.colors.secondaryContainer;
        }
    }
    if (isMode('contained')) {
        if (disabled) {
            return (0, color_1.default)(LightTheme_1.default.dark ? colors_1.white : colors_1.black)
                .alpha(0.12)
                .rgb()
                .string();
        }
        return LightTheme_1.default.colors.primary;
    }
    return 'transparent';
};
var getButtonTextColor = function (_a) {
    var isMode = _a.isMode, disabled = _a.disabled, customTextColor = _a.customTextColor, backgroundColor = _a.backgroundColor, dark = _a.dark;
    if (customTextColor && !disabled) {
        return customTextColor;
    }
    if (LightTheme_1.default.isV3) {
        if (disabled) {
            return LightTheme_1.default.colors.onSurfaceDisabled;
        }
        if (typeof dark === 'boolean') {
            if (isMode('contained') ||
                isMode('contained-tonal') ||
                isMode('elevated')) {
                return isDark({ dark: dark, backgroundColor: backgroundColor }) ? colors_1.white : colors_1.black;
            }
        }
        if (isMode('outlined') || isMode('text') || isMode('elevated')) {
            return LightTheme_1.default.colors.primary;
        }
        if (isMode('contained')) {
            return LightTheme_1.default.colors.onPrimary;
        }
        if (isMode('contained-tonal')) {
            return LightTheme_1.default.colors.onSecondaryContainer;
        }
    }
    if (disabled) {
        return (0, color_1.default)(LightTheme_1.default.dark ? colors_1.white : colors_1.black)
            .alpha(0.32)
            .rgb()
            .string();
    }
    if (isMode('contained')) {
        return isDark({ dark: dark, backgroundColor: backgroundColor }) ? colors_1.white : colors_1.black;
    }
    return LightTheme_1.default.colors.primary;
};
var getButtonBorderColor = function (_a) {
    var isMode = _a.isMode, disabled = _a.disabled;
    if (LightTheme_1.default.isV3) {
        if (disabled && isMode('outlined')) {
            return LightTheme_1.default.colors.surfaceDisabled;
        }
        if (isMode('outlined')) {
            return LightTheme_1.default.colors.outline;
        }
    }
    if (isMode('outlined')) {
        return (0, color_1.default)(LightTheme_1.default.dark ? colors_1.white : colors_1.black)
            .alpha(0.29)
            .rgb()
            .string();
    }
    return 'transparent';
};
var getButtonBorderWidth = function (_a) {
    var isMode = _a.isMode;
    if (LightTheme_1.default.isV3) {
        if (isMode('outlined')) {
            return 1;
        }
    }
    if (isMode('outlined')) {
        return react_native_1.StyleSheet.hairlineWidth;
    }
    return 0;
};
var getButtonColors = function (_a) {
    var mode = _a.mode, customButtonColor = _a.customButtonColor, customTextColor = _a.customTextColor, disabled = _a.disabled, dark = _a.dark;
    var isMode = function (modeToCompare) {
        return mode === modeToCompare;
    };
    var backgroundColor = getButtonBackgroundColor({
        isMode: isMode,
        disabled: disabled,
        customButtonColor: customButtonColor,
    });
    var textColor = getButtonTextColor({
        isMode: isMode,
        disabled: disabled,
        customTextColor: customTextColor,
        backgroundColor: backgroundColor,
        dark: dark,
    });
    var borderColor = getButtonBorderColor({ isMode: isMode, disabled: disabled });
    var borderWidth = getButtonBorderWidth({ isMode: isMode });
    return {
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        textColor: textColor,
        borderWidth: borderWidth,
    };
};
exports.getButtonColors = getButtonColors;
