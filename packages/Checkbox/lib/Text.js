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
var types_1 = require("./types");
var LightTheme_1 = __importDefault(require("./LightTheme"));
// @component-group Typography
/**
 * Typography component showing styles complied with passed `variant` prop and supported by the type system.
 *
 * <div class="screenshots">
 *   <img class="small" src="screenshots/typography.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <>
 *     <Text variant="displayLarge">Display Large</Text>
 *     <Text variant="displayMedium">Display Medium</Text>
 *     <Text variant="displaySmall">Display small</Text>
 *
 *     <Text variant="headlineLarge">Headline Large</Text>
 *     <Text variant="headlineMedium">Headline Medium</Text>
 *     <Text variant="headlineSmall">Headline Small</Text>
 *
 *     <Text variant="titleLarge">Title Large</Text>
 *     <Text variant="titleMedium">Title Medium</Text>
 *     <Text variant="titleSmall">Title Small</Text>
 *
 *     <Text variant="bodyLarge">Body Large</Text>
 *     <Text variant="bodyMedium">Body Medium</Text>
 *     <Text variant="bodySmall">Body Small</Text>
 *
 *     <Text variant="labelLarge">Label Large</Text>
 *     <Text variant="labelMedium">Label Medium</Text>
 *     <Text variant="labelSmall">Label Small</Text>
 *  </>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
var Text = function (_a, ref) {
    var _b, _c;
    var style = _a.style, variant = _a.variant, rest = __rest(_a, ["style", "variant"]);
    var root = React.useRef(null);
    // FIXME: destructure it in TS 4.6+
    var writingDirection = react_native_1.I18nManager.isRTL ? 'rtl' : 'ltr';
    React.useImperativeHandle(ref, function () { return ({
        setNativeProps: function (args) { var _a; return (_a = root.current) === null || _a === void 0 ? void 0 : _a.setNativeProps(args); },
    }); });
    if (LightTheme_1.default.isV3 && variant) {
        var stylesByVariant = Object.keys(types_1.MD3TypescaleKey).reduce(function (acc, key) {
            var _a;
            var _b = LightTheme_1.default.typescale[key], fontSize = _b.fontSize, fontWeight = _b.fontWeight, lineHeight = _b.lineHeight, letterSpacing = _b.letterSpacing, fontFamily = _b.fontFamily;
            return __assign(__assign({}, acc), (_a = {}, _a[key] = __assign(__assign({}, (react_native_1.Platform.OS === 'android' && { fontFamily: fontFamily })), { fontSize: fontSize, fontWeight: fontWeight, lineHeight: lineHeight, letterSpacing: letterSpacing, color: LightTheme_1.default.colors.onSurface }), _a));
        }, {});
        var styleForVariant = stylesByVariant[variant];
        return ((0, jsx_runtime_1.jsx)(react_native_1.Text, __assign({ ref: root, style: [styleForVariant, styles.text, { writingDirection: writingDirection }, style] }, rest)));
    }
    else {
        return ((0, jsx_runtime_1.jsx)(react_native_1.Text, __assign({}, rest, { ref: root, style: [
                __assign(__assign({}, (!LightTheme_1.default.isV3 && ((_b = LightTheme_1.default.fonts) === null || _b === void 0 ? void 0 : _b.regular))), { color: LightTheme_1.default.isV3 ? (_c = LightTheme_1.default.colors) === null || _c === void 0 ? void 0 : _c.onSurface : LightTheme_1.default.colors.text }),
                styles.text,
                style,
            ] })));
    }
};
var styles = react_native_1.StyleSheet.create({
    text: {
        textAlign: 'left',
    },
});
exports.default = React.forwardRef(Text);
