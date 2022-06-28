"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnimatedValue = void 0;
var color_1 = __importDefault(require("color"));
var react_native_1 = require("react-native");
var DarkTheme_1 = __importDefault(require("./v2/DarkTheme"));
var isAnimatedValue = function (it) { return it instanceof react_native_1.Animated.Value; };
exports.isAnimatedValue = isAnimatedValue;
function overlay(elevation, surfaceColor) {
    var _a;
    if (surfaceColor === void 0) { surfaceColor = (_a = DarkTheme_1.default.colors) === null || _a === void 0 ? void 0 : _a.surface; }
    if ((0, exports.isAnimatedValue)(elevation)) {
        var inputRange = [0, 1, 2, 3, 8, 24];
        // @ts-expect-error: TS doesn't seem to refine the type correctly
        return elevation.interpolate({
            inputRange: inputRange,
            outputRange: inputRange.map(function (elevation) {
                return calculateColor(surfaceColor, elevation);
            }),
        });
    }
    // @ts-expect-error: TS doesn't seem to refine the type correctly
    return calculateColor(surfaceColor, elevation);
}
exports.default = overlay;
function calculateColor(surfaceColor, elevation) {
    if (elevation === void 0) { elevation = 1; }
    var overlayTransparency;
    if (elevation >= 1 && elevation <= 24) {
        overlayTransparency = elevationOverlayTransparency[elevation];
    }
    else if (elevation > 24) {
        overlayTransparency = elevationOverlayTransparency[24];
    }
    else {
        overlayTransparency = elevationOverlayTransparency[1];
    }
    return (0, color_1.default)(surfaceColor)
        .mix((0, color_1.default)('white'), overlayTransparency * 0.01)
        .hex();
}
var elevationOverlayTransparency = {
    1: 5,
    2: 7,
    3: 8,
    4: 9,
    5: 10,
    6: 11,
    7: 11.5,
    8: 12,
    9: 12.5,
    10: 13,
    11: 13.5,
    12: 14,
    13: 14.25,
    14: 14.5,
    15: 14.75,
    16: 15,
    17: 15.12,
    18: 15.24,
    19: 15.36,
    20: 15.48,
    21: 15.6,
    22: 15.72,
    23: 15.84,
    24: 16,
};
