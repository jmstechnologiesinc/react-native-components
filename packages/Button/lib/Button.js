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
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var color_1 = __importDefault(require("color"));
var react_native_fontawesome_1 = require("@fortawesome/react-native-fontawesome");
var ActivityIndicator_1 = __importDefault(require("./ActivityIndicator"));
var Surface_1 = __importDefault(require("./Surface"));
var Text_1 = __importDefault(require("./Text"));
var TouchableRipple_1 = __importDefault(require("./TouchableRipple/TouchableRipple"));
var utils_1 = require("./utils");
var LightTheme_1 = __importDefault(require("./LightTheme"));
/**
 * A button is component that the user can press to trigger an action.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/button-1.png" />
 *     <figcaption>Text button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-2.png" />
 *     <figcaption>Outlined button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-3.png" />
 *     <figcaption>Contained button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-4.png" />
 *     <figcaption>Elevated button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-5.png" />
 *     <figcaption>Contained-tonal button</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 *
 * export default MyComponent;
 * ```
 */
var Button = function (_a) {
    var _b;
    var disabled = _a.disabled, compact = _a.compact, _c = _a.mode, mode = _c === void 0 ? 'text' : _c, dark = _a.dark, loading = _a.loading, icon = _a.icon, customButtonColor = _a.buttonColor, customTextColor = _a.textColor, children = _a.children, accessibilityLabel = _a.accessibilityLabel, accessibilityHint = _a.accessibilityHint, onPress = _a.onPress, onLongPress = _a.onLongPress, style = _a.style, _d = _a.uppercase, uppercase = _d === void 0 ? !LightTheme_1.default.isV3 : _d, contentStyle = _a.contentStyle, labelStyle = _a.labelStyle, testID = _a.testID, accessible = _a.accessible, rest = __rest(_a, ["disabled", "compact", "mode", "dark", "loading", "icon", "buttonColor", "textColor", "children", "accessibilityLabel", "accessibilityHint", "onPress", "onLongPress", "style", "uppercase", "contentStyle", "labelStyle", "testID", "accessible"]);
    var isMode = React.useCallback(function (modeToCompare) {
        return mode === modeToCompare;
    }, [mode]);
    var roundness = LightTheme_1.default.roundness, isV3 = LightTheme_1.default.isV3, animation = LightTheme_1.default.animation;
    var isElevationEntitled = !disabled && (isV3 ? isMode('elevated') : isMode('contained'));
    var initialElevation = isV3 ? 1 : 2;
    var activeElevation = isV3 ? 2 : 8;
    var elevation = React.useRef(new react_native_1.Animated.Value(isElevationEntitled ? initialElevation : 0)).current;
    React.useEffect(function () {
        elevation.setValue(isElevationEntitled ? initialElevation : 0);
    }, [isElevationEntitled, elevation, initialElevation]);
    var handlePressIn = function () {
        if (isMode('contained')) {
            var scale = animation.scale;
            react_native_1.Animated.timing(elevation, {
                toValue: activeElevation,
                duration: 200 * scale,
                useNativeDriver: true,
            }).start();
        }
    };
    var handlePressOut = function () {
        if (isMode('contained')) {
            var scale = animation.scale;
            react_native_1.Animated.timing(elevation, {
                toValue: initialElevation,
                duration: 150 * scale,
                useNativeDriver: true,
            }).start();
        }
    };
    var borderRadius = (isV3 ? 5 : 1) * roundness;
    var iconSize = isV3 ? 18 : 16;
    var _e = (0, utils_1.getButtonColors)({
        customButtonColor: customButtonColor,
        customTextColor: customTextColor,
        mode: mode,
        disabled: disabled,
        dark: dark,
    }), backgroundColor = _e.backgroundColor, borderColor = _e.borderColor, textColor = _e.textColor, borderWidth = _e.borderWidth;
    var rippleColor = (0, color_1.default)(textColor).alpha(0.12).rgb().string();
    var buttonStyle = {
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: borderWidth,
        borderRadius: borderRadius,
    };
    var touchableStyle = {
        borderRadius: style
            ? (react_native_1.StyleSheet.flatten(style) || {}).borderRadius ||
                borderRadius
            : borderRadius,
    };
    var _f = react_native_1.StyleSheet.flatten(labelStyle) || {}, customLabelColor = _f.color, customLabelSize = _f.fontSize;
    var textStyle = __assign({ color: textColor }, (isV3 ? LightTheme_1.default.typescale.labelLarge : LightTheme_1.default.fonts.medium));
    var iconStyle = ((_b = react_native_1.StyleSheet.flatten(contentStyle)) === null || _b === void 0 ? void 0 : _b.flexDirection) === 'row-reverse'
        ? [
            styles.iconReverse,
            isV3 && styles.md3IconReverse,
            isV3 && isMode('text') && styles.md3IconReverseTextMode,
        ]
        : [
            styles.icon,
            isV3 && styles.md3Icon,
            isV3 && isMode('text') && styles.md3IconTextMode,
        ];
    return ((0, jsx_runtime_1.jsx)(Surface_1.default, __assign({}, rest, { style: [
            styles.button,
            compact && styles.compact,
            buttonStyle,
            style,
            !isV3 && { elevation: elevation },
        ] }, (isV3 && { elevation: elevation }), { children: (0, jsx_runtime_1.jsx)(TouchableRipple_1.default, __assign({ borderless: true, delayPressIn: 0, onPress: onPress, onLongPress: onLongPress, onPressIn: handlePressIn, onPressOut: handlePressOut, accessibilityLabel: accessibilityLabel, accessibilityHint: accessibilityHint, accessibilityRole: "button", accessibilityState: { disabled: disabled }, accessible: accessible, disabled: disabled, rippleColor: rippleColor, style: touchableStyle, testID: testID }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: [styles.content, contentStyle] }, { children: [icon && loading !== true ? ((0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: iconStyle }, { children: (0, jsx_runtime_1.jsx)(react_native_fontawesome_1.FontAwesomeIcon, { icon: icon, size: customLabelSize !== null && customLabelSize !== void 0 ? customLabelSize : iconSize, color: typeof customLabelColor === 'string'
                                ? customLabelColor
                                : textColor }) }))) : null, loading ? ((0, jsx_runtime_1.jsx)(ActivityIndicator_1.default, { size: customLabelSize !== null && customLabelSize !== void 0 ? customLabelSize : iconSize, color: typeof customLabelColor === 'string'
                            ? customLabelColor
                            : textColor, style: iconStyle })) : null, (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: "labelLarge", selectable: false, numberOfLines: 1, style: [
                            styles.label,
                            !isV3 && styles.md2Label,
                            isV3 &&
                                (isMode('text')
                                    ? icon || loading
                                        ? styles.md3LabelTextAddons
                                        : styles.md3LabelText
                                    : styles.md3Label),
                            compact && styles.compactLabel,
                            uppercase && styles.uppercaseLabel,
                            textStyle,
                            labelStyle,
                        ] }, { children: children }))] })) })) })));
};
var styles = react_native_1.StyleSheet.create({
    button: {
        minWidth: 64,
        borderStyle: 'solid',
    },
    compact: {
        minWidth: 'auto',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginLeft: 12,
        marginRight: -4,
    },
    iconReverse: {
        marginRight: 12,
        marginLeft: -4,
    },
    md3Icon: {
        marginLeft: 16,
        marginRight: -16,
    },
    md3IconReverse: {
        marginLeft: -16,
        marginRight: 16,
    },
    md3IconTextMode: {
        marginLeft: 12,
        marginRight: -8,
    },
    md3IconReverseTextMode: {
        marginLeft: -8,
        marginRight: 12,
    },
    label: {
        textAlign: 'center',
        marginVertical: 9,
        marginHorizontal: 16,
    },
    md2Label: {
        letterSpacing: 1,
    },
    compactLabel: {
        marginHorizontal: 8,
    },
    uppercaseLabel: {
        textTransform: 'uppercase',
    },
    md3Label: {
        marginVertical: 10,
        marginHorizontal: 24,
    },
    md3LabelText: {
        marginHorizontal: 12,
    },
    md3LabelTextAddons: {
        marginHorizontal: 16,
    },
});
exports.default = Button;
