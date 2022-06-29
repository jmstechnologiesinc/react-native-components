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
exports.Checkboxs = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_1 = require("react-native");
var Checkbox_1 = __importDefault(require("./Checkbox"));
var storybook_addon_state_1 = __importDefault(require("storybook-addon-state"));
var TouchableRipple_1 = __importDefault(require("./TouchableRipple/TouchableRipple"));
var Text_1 = __importDefault(require("./Text"));
exports.default = {
    title: 'packages/Checkbox',
    component: Checkbox_1.default,
};
var Checkboxs = function () {
    var _a = (0, storybook_addon_state_1.default)(), checkedNormal = _a[0], setCheckedNormal = _a[1];
    var _b = (0, storybook_addon_state_1.default)(), checkedCustom = _b[0], setCheckedCustom = _b[1];
    var _c = (0, storybook_addon_state_1.default)(), indeterminate = _c[0], setIndeterminate = _c[1];
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: [
            styles.container,
            {
                backgroundColor: '#fff',
            },
        ] }, { children: [(0, jsx_runtime_1.jsx)(TouchableRipple_1.default, __assign({ onPress: function () { return setCheckedNormal(!checkedNormal); } }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Text_1.default, { children: "Normal" }), (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ pointerEvents: "none" }, { children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { status: checkedNormal ? 'checked' : 'unchecked' }) }))] })) })), (0, jsx_runtime_1.jsx)(TouchableRipple_1.default, __assign({ onPress: function () { return setCheckedCustom(!checkedCustom); } }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Text_1.default, { children: "Custom" }), (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ pointerEvents: "none" }, { children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { color: '#f00', status: checkedCustom ? 'checked' : 'unchecked' }) }))] })) })), (0, jsx_runtime_1.jsx)(TouchableRipple_1.default, __assign({ onPress: function () { return setIndeterminate(!indeterminate); } }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Text_1.default, { children: "Indeterminate" }), (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ pointerEvents: "none" }, { children: (0, jsx_runtime_1.jsx)(Checkbox_1.default, { status: indeterminate ? 'indeterminate' : 'unchecked' }) }))] })) })), (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Text_1.default, { children: "Checked (Disabled)" }), (0, jsx_runtime_1.jsx)(Checkbox_1.default, { status: "checked", disabled: true })] })), (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Text_1.default, { children: "Unchecked (Disabled)" }), (0, jsx_runtime_1.jsx)(Checkbox_1.default, { status: "unchecked", disabled: true })] })), (0, jsx_runtime_1.jsxs)(react_native_1.View, __assign({ style: styles.row }, { children: [(0, jsx_runtime_1.jsx)(Text_1.default, { children: "Indeterminate (Disabled)" }), (0, jsx_runtime_1.jsx)(Checkbox_1.default, { status: "indeterminate", disabled: true })] }))] })));
};
exports.Checkboxs = Checkboxs;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
});
