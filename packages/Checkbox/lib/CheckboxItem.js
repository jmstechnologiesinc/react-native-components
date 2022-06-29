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
exports.CheckboxItem = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_1 = require("react-native");
var Checkbox_1 = __importDefault(require("./Checkbox"));
var CheckboxAndroid_1 = __importDefault(require("./CheckboxAndroid"));
var CheckboxIOS_1 = __importDefault(require("./CheckboxIOS"));
var Text_1 = __importDefault(require("./Text"));
var TouchableRipple_1 = __importDefault(require("./TouchableRipple/TouchableRipple"));
var LightTheme_1 = __importDefault(require("./LightTheme"));
/**
 * Checkbox.Item allows you to press the whole row (item) instead of only the Checkbox.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <View>
 *     <Checkbox.Item label="Item" status="checked" />
 *   </View>
 * );
 *
 * export default MyComponent;
 *```
 */
var CheckboxItem = function (_a) {
    var style = _a.style, status = _a.status, label = _a.label, onPress = _a.onPress, labelStyle = _a.labelStyle, testID = _a.testID, mode = _a.mode, _b = _a.position, position = _b === void 0 ? 'trailing' : _b, _c = _a.accessibilityLabel, accessibilityLabel = _c === void 0 ? label : _c, disabled = _a.disabled, _d = _a.labelVariant, labelVariant = _d === void 0 ? 'bodyLarge' : _d, props = __rest(_a, ["style", "status", "label", "onPress", "labelStyle", "testID", "mode", "position", "accessibilityLabel", "disabled", "labelVariant"]);
    var checkboxProps = __assign(__assign({}, props), { status: status, theme: LightTheme_1.default, disabled: disabled });
    var isLeading = position === 'leading';
    var checkbox;
    if (mode === 'android') {
        checkbox = (0, jsx_runtime_1.jsx)(CheckboxAndroid_1.default, __assign({}, checkboxProps));
    }
    else if (mode === 'ios') {
        checkbox = (0, jsx_runtime_1.jsx)(CheckboxIOS_1.default, __assign({}, checkboxProps));
    }
    else {
        checkbox = (0, jsx_runtime_1.jsx)(Checkbox_1.default, __assign({}, checkboxProps));
    }
    var textColor = LightTheme_1.default.isV3 ? LightTheme_1.default.colors.onSurface : LightTheme_1.default.colors.text;
    var disabledTextColor = LightTheme_1.default.isV3
        ? LightTheme_1.default.colors.onSurfaceDisabled
        : LightTheme_1.default.colors.disabled;
    var textAlign = isLeading ? 'right' : 'left';
    var computedStyle = {
        color: disabled ? disabledTextColor : textColor,
        textAlign: textAlign,
    };
    return ((0, jsx_runtime_1.jsx)(TouchableRipple_1.default, __assign({ accessibilityLabel: accessibilityLabel, accessibilityRole: "checkbox", accessibilityState: {
            checked: status === 'checked',
            disabled: disabled,
        }, onPress: onPress, testID: testID, disabled: disabled }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: [styles.container, style], pointerEvents: "none", importantForAccessibility: "no-hide-descendants" }, { children: [isLeading && checkbox, (0, jsx_runtime_1.jsx)(Text_1.default, __assign({ variant: labelVariant, style: [
                        styles.label,
                        !LightTheme_1.default.isV3 && styles.font,
                        computedStyle,
                        labelStyle,
                    ] }, { children: label })), !isLeading && checkbox] })) })));
};
exports.CheckboxItem = CheckboxItem;
CheckboxItem.displayName = 'Checkbox.Item';
exports.default = CheckboxItem;
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    label: {
        flexShrink: 1,
        flexGrow: 1,
    },
    font: {
        fontSize: 16,
    },
});
