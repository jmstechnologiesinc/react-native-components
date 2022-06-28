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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomIcon = exports.ContainedButton = exports.OutlinedButton = exports.TextButton = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_1 = require("react-native");
var Button_1 = __importDefault(require("./Button"));
var LightTheme_1 = __importDefault(require("../../ReactNativePaper/styles/themes/v2/LightTheme"));
var colors = LightTheme_1.default.colors;
exports.default = {
    title: 'packages/Button',
    component: Button_1.default,
};
var TextButton = function () { return ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, __assign({ style: [styles.container] }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, __assign({ onPress: function () { }, style: styles.button }, { children: "Default" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ buttonColor: colors.accent, onPress: function () { }, style: styles.button }, { children: "Custom" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ disabled: true, onPress: function () { }, style: styles.button }, { children: "Disabled" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ icon: "camera", onPress: function () { }, style: styles.button }, { children: "Icon" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ loading: true, onPress: function () { }, style: styles.button }, { children: "Loading" }))] })) }))); };
exports.TextButton = TextButton;
var OutlinedButton = function () { return ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, __assign({ style: [styles.container] }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", onPress: function () { }, style: styles.button }, { children: "Default" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", buttonColor: colors.accent, onPress: function () { }, style: styles.button }, { children: "Custom" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", disabled: true, onPress: function () { }, style: styles.button }, { children: "Disabled" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", icon: "camera", onPress: function () { }, style: styles.button }, { children: "Icon" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", loading: true, onPress: function () { }, style: styles.button }, { children: "Loading" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", onPress: function () { }, style: styles.button, labelStyle: {
                    fontWeight: '800',
                    fontSize: 18,
                } }, { children: "Custom Font" }))] })) }))); };
exports.OutlinedButton = OutlinedButton;
var ContainedButton = function () { return ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, __assign({ style: [styles.container] }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "contained", onPress: function () { }, style: styles.button }, { children: "Default" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "contained", buttonColor: colors.accent, onPress: function () { }, style: styles.button }, { children: "Custom" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "contained", disabled: true, onPress: function () { }, style: styles.button }, { children: "Disabled" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "contained", icon: "camera", onPress: function () { }, style: styles.button }, { children: "Icon" })), (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "contained", loading: true, onPress: function () { }, style: styles.button }, { children: "Loading" }))] })) }))); };
exports.ContainedButton = ContainedButton;
var CustomIcon = function () { return ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, __assign({ style: [styles.container] }, { children: (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: styles.row }, { children: (0, jsx_runtime_1.jsx)(Button_1.default, __assign({ mode: "outlined", icon: {
                uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400',
            }, onPress: function () { }, style: styles.button }, { children: "Remote image" })) })) }))); };
exports.CustomIcon = CustomIcon;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    button: {
        margin: 4,
    },
});
