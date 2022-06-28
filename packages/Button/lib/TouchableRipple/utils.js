"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTouchableRippleColors = void 0;
var color_1 = __importDefault(require("color"));
var LightTheme_1 = __importDefault(require("../LightTheme"));
var getUnderlayColor = function (_a) {
    var calculatedRippleColor = _a.calculatedRippleColor, underlayColor = _a.underlayColor;
    if (underlayColor != null) {
        return underlayColor;
    }
    if (LightTheme_1.default.isV3) {
        return (0, color_1.default)(calculatedRippleColor).rgb().string();
    }
    return (0, color_1.default)(calculatedRippleColor).fade(0.5).rgb().string();
};
var getRippleColor = function (_a) {
    var rippleColor = _a.rippleColor;
    if (rippleColor) {
        return rippleColor;
    }
    if (LightTheme_1.default.isV3) {
        return (0, color_1.default)(LightTheme_1.default.colors.onSurface).alpha(0.12).rgb().string();
    }
    if (LightTheme_1.default.dark) {
        return (0, color_1.default)(LightTheme_1.default.colors.text).alpha(0.32).rgb().string();
    }
    return (0, color_1.default)(LightTheme_1.default.colors.text).alpha(0.2).rgb().string();
};
var getTouchableRippleColors = function (_a) {
    var rippleColor = _a.rippleColor, underlayColor = _a.underlayColor;
    var calculatedRippleColor = getRippleColor({ rippleColor: rippleColor });
    return {
        calculatedRippleColor: calculatedRippleColor,
        calculatedUnderlayColor: getUnderlayColor({
            calculatedRippleColor: calculatedRippleColor,
            underlayColor: underlayColor,
        }),
    };
};
exports.getTouchableRippleColors = getTouchableRippleColors;
