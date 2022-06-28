"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_1 = require("react-native");
var shadow_1 = __importDefault(require("./shadow"));
var overlay_1 = __importStar(require("./overlay"));
var LightTheme_1 = __importDefault(require("./LightTheme"));
var MD2Surface = function (_a) {
    var style = _a.style, rest = __rest(_a, ["style"]);
    var _b = (react_native_1.StyleSheet.flatten(style) || {}).elevation, elevation = _b === void 0 ? 4 : _b;
    var isDarkTheme = LightTheme_1.default.dark, mode = LightTheme_1.default.mode, colors = LightTheme_1.default.colors;
    return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({}, rest, { style: [
            {
                backgroundColor: isDarkTheme && mode === 'adaptive'
                    ? (0, overlay_1.default)(elevation, colors === null || colors === void 0 ? void 0 : colors.surface)
                    : colors === null || colors === void 0 ? void 0 : colors.surface,
            },
            elevation ? (0, shadow_1.default)(elevation) : null,
            style,
        ] })));
};
/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * On dark theme with `adaptive` mode, surface is constructed by also placing a semi-transparent white overlay over a component surface.
 * See [Dark Theme](https://callstack.github.io/react-native-paper/theming.html#dark-theme) for more information.
 * Overlay and shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/surface-android.png" />
 *     <figcaption>Surface on Android</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/surface-ios.png" />
 *     <figcaption>Surface on iOS</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *   <Surface style={styles.surface} elevation={4}>
 *      <Text>Surface</Text>
 *   </Surface>
 * );
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   surface: {
 *     padding: 8,
 *     height: 80,
 *     width: 80,
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *   },
 * });
 * ```
 */
var Surface = function (_a) {
    var _b = _a.elevation, elevation = _b === void 0 ? 1 : _b, children = _a.children, style = _a.style, props = __rest(_a, ["elevation", "children", "style"]);
    if (!LightTheme_1.default.isV3)
        return ((0, jsx_runtime_1.jsx)(MD2Surface, __assign({}, props, { style: style }, { children: children })));
    var colors = LightTheme_1.default.colors;
    var inputRange = [0, 1, 2, 3, 4, 5];
    var backgroundColor = (function () {
        var _a;
        if ((0, overlay_1.isAnimatedValue)(elevation)) {
            return elevation.interpolate({
                inputRange: inputRange,
                outputRange: inputRange.map(function (elevation) {
                    var _a;
                    return (_a = colors.elevation) === null || _a === void 0 ? void 0 : _a["level".concat(elevation)];
                }),
            });
        }
        return (_a = colors.elevation) === null || _a === void 0 ? void 0 : _a["level".concat(elevation)];
    })();
    var sharedStyle = [{ backgroundColor: backgroundColor }, style];
    if (react_native_1.Platform.OS === 'web') {
        return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({}, props, { style: [
                { backgroundColor: backgroundColor },
                elevation ? (0, shadow_1.default)(elevation, LightTheme_1.default.isV3) : null,
                style,
            ] }, { children: children })));
    }
    if (react_native_1.Platform.OS === 'android') {
        var elevationLevel_1 = [0, 3, 6, 9, 12, 15];
        var getElevationAndroid = function () {
            if ((0, overlay_1.isAnimatedValue)(elevation)) {
                return elevation.interpolate({
                    inputRange: inputRange,
                    outputRange: elevationLevel_1,
                });
            }
            return elevationLevel_1[elevation];
        };
        var _c = react_native_1.StyleSheet.flatten(style), margin = _c.margin, padding = _c.padding, transform = _c.transform, borderRadius = _c.borderRadius;
        var outerLayerStyles = { margin: margin, padding: padding, transform: transform, borderRadius: borderRadius };
        return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: [
                {
                    backgroundColor: backgroundColor,
                    transform: transform,
                },
                outerLayerStyles,
                sharedStyle,
                {
                    elevation: getElevationAndroid(),
                },
            ] }, { children: children })));
    }
    var iOSShadowOutputRanges = [
        {
            shadowOpacity: 0.15,
            height: [0, 1, 2, 4, 6, 8],
            shadowRadius: [0, 3, 6, 8, 10, 12],
        },
        {
            shadowOpacity: 0.3,
            height: [0, 1, 1, 1, 2, 4],
            shadowRadius: [0, 1, 2, 3, 3, 4],
        },
    ];
    var shadowColor = '#000';
    if ((0, overlay_1.isAnimatedValue)(elevation)) {
        var inputRange_1 = [0, 1, 2, 3, 4, 5];
        var getStyleForAnimatedShadowLayer = function (layer) {
            return {
                shadowColor: shadowColor,
                shadowOpacity: elevation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, iOSShadowOutputRanges[layer].shadowOpacity],
                    extrapolate: 'clamp',
                }),
                shadowOffset: {
                    width: 0,
                    height: elevation.interpolate({
                        inputRange: inputRange_1,
                        outputRange: iOSShadowOutputRanges[layer].height,
                    }),
                },
                shadowRadius: elevation.interpolate({
                    inputRange: inputRange_1,
                    outputRange: iOSShadowOutputRanges[layer].shadowRadius,
                }),
            };
        };
        return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: getStyleForAnimatedShadowLayer(0) }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: getStyleForAnimatedShadowLayer(1) }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({}, props, { style: sharedStyle }, { children: children })) })) })));
    }
    var getStyleForShadowLayer = function (layer) {
        return {
            shadowColor: shadowColor,
            shadowOpacity: elevation ? iOSShadowOutputRanges[layer].shadowOpacity : 0,
            shadowOffset: {
                width: 0,
                height: iOSShadowOutputRanges[layer].height[elevation],
            },
            shadowRadius: iOSShadowOutputRanges[layer].shadowRadius[elevation],
        };
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: getStyleForShadowLayer(0) }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: getStyleForShadowLayer(1) }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({}, props, { style: sharedStyle }, { children: children })) })) })));
};
exports.default = Surface;
