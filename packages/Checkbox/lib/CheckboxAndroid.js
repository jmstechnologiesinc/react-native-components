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
exports.CheckboxAndroid = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = __importStar(require("react"));
var react_native_1 = require("react-native");
var TouchableRipple_1 = __importDefault(require("./TouchableRipple/TouchableRipple"));
var LightTheme_1 = __importDefault(require("./LightTheme"));
var utils_1 = require("./utils");
var react_native_fontawesome_1 = require("@fortawesome/react-native-fontawesome");
var pro_regular_svg_icons_1 = require("@fortawesome/pro-regular-svg-icons");
// From https://material.io/design/motion/speed.html#duration
var ANIMATION_DURATION = 100;
/**
 * Checkboxes allow the selection of multiple options from a set.
 * This component follows platform guidelines for Android, but can be used
 * on any platform.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.android.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.android.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
var CheckboxAndroid = function (_a) {
    var status = _a.status, disabled = _a.disabled, onPress = _a.onPress, testID = _a.testID, rest = __rest(_a, ["status", "disabled", "onPress", "testID"]);
    var scaleAnim = React.useRef(new react_native_1.Animated.Value(1)).current;
    var isFirstRendering = React.useRef(true);
    var scale = LightTheme_1.default.animation.scale;
    React.useEffect(function () {
        // Do not run animation on very first rendering
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }
        var checked = status === 'checked';
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(scaleAnim, {
                toValue: 0.85,
                duration: checked ? ANIMATION_DURATION * scale : 0,
                useNativeDriver: false,
            }),
            react_native_1.Animated.timing(scaleAnim, {
                toValue: 1,
                duration: checked
                    ? ANIMATION_DURATION * scale
                    : ANIMATION_DURATION * scale * 1.75,
                useNativeDriver: false,
            }),
        ]).start();
    }, [status, scaleAnim, scale]);
    var checked = status === 'checked';
    var indeterminate = status === 'indeterminate';
    var _b = (0, utils_1.getAndroidSelectionControlColor)({
        disabled: disabled,
        checked: checked,
        customColor: rest.color,
        customUncheckedColor: rest.uncheckedColor,
    }), rippleColor = _b.rippleColor, selectionControlColor = _b.selectionControlColor;
    var borderWidth = scaleAnim.interpolate({
        inputRange: [0.8, 1],
        outputRange: [7, 0],
    });
    var icon = indeterminate ? pro_regular_svg_icons_1.faCheck : checked ? pro_regular_svg_icons_1.faSquare : pro_regular_svg_icons_1.faCircle;
    return ((0, jsx_runtime_1.jsx)(TouchableRipple_1.default, __assign({}, rest, { borderless: true, rippleColor: rippleColor, onPress: onPress, disabled: disabled, accessibilityRole: "checkbox", accessibilityState: { disabled: disabled, checked: checked }, accessibilityLiveRegion: "polite", style: styles.container, testID: testID }, { children: (0, jsx_runtime_1.jsxs)(react_native_1.Animated.View, __assign({ style: { transform: [{ scale: scaleAnim }] } }, { children: [(0, jsx_runtime_1.jsx)(react_native_fontawesome_1.FontAwesomeIcon, { icon: icon, size: 24, color: selectionControlColor }), (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: [react_native_1.StyleSheet.absoluteFill, styles.fillContainer] }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { style: [
                            styles.fill,
                            { borderColor: selectionControlColor },
                            { borderWidth: borderWidth },
                        ] }) }))] })) })));
};
exports.CheckboxAndroid = CheckboxAndroid;
CheckboxAndroid.displayName = 'Checkbox.Android';
var styles = react_native_1.StyleSheet.create({
    container: {
        borderRadius: 18,
        width: 36,
        height: 36,
        padding: 6,
    },
    fillContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: {
        height: 14,
        width: 14,
    },
});
exports.default = CheckboxAndroid;
