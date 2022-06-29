"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectionControlIOSColor = exports.getAndroidSelectionControlColor = void 0;
var color_1 = __importDefault(require("color"));
var LightTheme_1 = __importDefault(require("./LightTheme"));
var getAndroidCheckedColor = function (_a) {
    var customColor = _a.customColor;
    if (customColor) {
        return customColor;
    }
    if (LightTheme_1.default.isV3) {
        return LightTheme_1.default.colors.primary;
    }
    return LightTheme_1.default.colors.accent;
};
var getAndroidUncheckedColor = function (_a) {
    var customUncheckedColor = _a.customUncheckedColor;
    if (customUncheckedColor) {
        return customUncheckedColor;
    }
    if (LightTheme_1.default.isV3) {
        return LightTheme_1.default.colors.onSurfaceVariant;
    }
    if (LightTheme_1.default.dark) {
        return (0, color_1.default)(LightTheme_1.default.colors.text).alpha(0.7).rgb().string();
    }
    return (0, color_1.default)(LightTheme_1.default.colors.text).alpha(0.54).rgb().string();
};
var getAndroidRippleColor = function (_a) {
    var checkedColor = _a.checkedColor, disabled = _a.disabled;
    if (disabled) {
        if (LightTheme_1.default.isV3) {
            return (0, color_1.default)(LightTheme_1.default.colors.onSurface).alpha(0.16).rgb().string();
        }
        return (0, color_1.default)(LightTheme_1.default.colors.text).alpha(0.16).rgb().string();
    }
    return (0, color_1.default)(checkedColor).fade(0.32).rgb().string();
};
var getAndroidControlColor = function (_a) {
    var checked = _a.checked, disabled = _a.disabled, checkedColor = _a.checkedColor, uncheckedColor = _a.uncheckedColor;
    if (disabled) {
        if (LightTheme_1.default.isV3) {
            return LightTheme_1.default.colors.onSurfaceDisabled;
        }
        return LightTheme_1.default.colors.text;
    }
    if (checked) {
        return checkedColor;
    }
    return uncheckedColor;
};
var getAndroidSelectionControlColor = function (_a) {
    var disabled = _a.disabled, checked = _a.checked, customColor = _a.customColor, customUncheckedColor = _a.customUncheckedColor;
    var checkedColor = getAndroidCheckedColor({ customColor: customColor });
    var uncheckedColor = getAndroidUncheckedColor({
        customUncheckedColor: customUncheckedColor,
    });
    return {
        rippleColor: getAndroidRippleColor({ checkedColor: checkedColor, disabled: disabled }),
        selectionControlColor: getAndroidControlColor({
            disabled: disabled,
            checked: checked,
            checkedColor: checkedColor,
            uncheckedColor: uncheckedColor,
        }),
    };
};
exports.getAndroidSelectionControlColor = getAndroidSelectionControlColor;
var getIOSCheckedColor = function (_a) {
    var disabled = _a.disabled, customColor = _a.customColor;
    if (disabled) {
        if (LightTheme_1.default.isV3) {
            return LightTheme_1.default.colors.onSurfaceDisabled;
        }
        return LightTheme_1.default.colors.disabled;
    }
    if (customColor) {
        return customColor;
    }
    if (LightTheme_1.default.isV3) {
        return LightTheme_1.default.colors.primary;
    }
    return LightTheme_1.default.colors.accent;
};
var getIOSRippleColor = function (_a) {
    var checkedColor = _a.checkedColor, disabled = _a.disabled;
    if (disabled) {
        if (LightTheme_1.default.isV3) {
            return (0, color_1.default)(LightTheme_1.default.colors.onSurface).alpha(0.16).rgb().string();
        }
        return (0, color_1.default)(LightTheme_1.default.colors.text).alpha(0.16).rgb().string();
    }
    return (0, color_1.default)(checkedColor).fade(0.32).rgb().string();
};
var getSelectionControlIOSColor = function (_a) {
    var disabled = _a.disabled, customColor = _a.customColor;
    var checkedColor = getIOSCheckedColor({ disabled: disabled, customColor: customColor });
    return {
        checkedColor: checkedColor,
        rippleColor: getIOSRippleColor({
            checkedColor: checkedColor,
            disabled: disabled,
        }),
    };
};
exports.getSelectionControlIOSColor = getSelectionControlIOSColor;
