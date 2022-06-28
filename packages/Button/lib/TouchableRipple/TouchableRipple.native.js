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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var utils_1 = require("./utils");
var ANDROID_VERSION_LOLLIPOP = 21;
var ANDROID_VERSION_PIE = 28;
var TouchableRipple = function (_a) {
    var style = _a.style, background = _a.background, _b = _a.borderless, borderless = _b === void 0 ? false : _b, disabledProp = _a.disabled, rippleColor = _a.rippleColor, underlayColor = _a.underlayColor, children = _a.children, rest = __rest(_a, ["style", "background", "borderless", "disabled", "rippleColor", "underlayColor", "children"]);
    var disabled = disabledProp || !rest.onPress;
    var _c = (0, utils_1.getTouchableRippleColors)({
        rippleColor: rippleColor,
        underlayColor: underlayColor,
    }), calculatedRippleColor = _c.calculatedRippleColor, calculatedUnderlayColor = _c.calculatedUnderlayColor;
    // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
    // https://github.com/facebook/react-native/issues/6480
    var useForeground = react_native_1.Platform.OS === 'android' &&
        react_native_1.Platform.Version >= ANDROID_VERSION_PIE &&
        borderless;
    if (TouchableRipple.supported) {
        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableNativeFeedback, __assign({}, rest, { disabled: disabled, useForeground: useForeground, background: background != null
                ? background
                : react_native_1.TouchableNativeFeedback.Ripple(calculatedRippleColor, borderless) }, { children: (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: [borderless && styles.overflowHidden, style] }, { children: React.Children.only(children) })) })));
    }
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableHighlight, __assign({}, rest, { disabled: disabled, style: [borderless && styles.overflowHidden, style], underlayColor: calculatedUnderlayColor }, { children: React.Children.only(children) })));
};
TouchableRipple.supported =
    react_native_1.Platform.OS === 'android' && react_native_1.Platform.Version >= ANDROID_VERSION_LOLLIPOP;
var styles = react_native_1.StyleSheet.create({
    overflowHidden: {
        overflow: 'hidden',
    },
});
exports.default = TouchableRipple;
