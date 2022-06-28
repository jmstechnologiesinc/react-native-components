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
var LightTheme_1 = __importDefault(require("./LightTheme"));
var DURATION = 2400;
/**
 * Activity indicator is used to present progress of some activity in the app.
 * It can be used as a drop-in for the ActivityIndicator shipped with React Native.
 *
 * <div class="screenshots">
 *   <img src="screenshots/activity-indicator.gif" style="width: 100px;" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ActivityIndicator, MD2Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ActivityIndicator animating={true} color={MD2Colors.red800} />
 * );
 *
 * export default MyComponent;
 * ```
 */
var ActivityIndicator = function (_a) {
    var _b;
    var _c = _a.animating, animating = _c === void 0 ? true : _c, indicatorColor = _a.color, _d = _a.hidesWhenStopped, hidesWhenStopped = _d === void 0 ? true : _d, _e = _a.size, indicatorSize = _e === void 0 ? 'small' : _e, style = _a.style, rest = __rest(_a, ["animating", "color", "hidesWhenStopped", "size", "style"]);
    var timer = React.useRef(new react_native_1.Animated.Value(0)).current;
    var fade = React.useRef(new react_native_1.Animated.Value(!animating && hidesWhenStopped ? 0 : 1)).current;
    var rotation = React.useRef(undefined);
    var scale = LightTheme_1.default.animation.scale;
    var startRotation = React.useCallback(function () {
        // Show indicator
        react_native_1.Animated.timing(fade, {
            duration: 200 * scale,
            toValue: 1,
            isInteraction: false,
            useNativeDriver: true,
        }).start();
        // Circular animation in loop
        if (rotation.current) {
            timer.setValue(0);
            // $FlowFixMe
            react_native_1.Animated.loop(rotation.current).start();
        }
    }, [scale, fade, timer]);
    var stopRotation = function () {
        if (rotation.current) {
            rotation.current.stop();
        }
    };
    React.useEffect(function () {
        if (rotation.current === undefined) {
            // Circular animation in loop
            rotation.current = react_native_1.Animated.timing(timer, {
                duration: DURATION,
                easing: react_native_1.Easing.linear,
                // Animated.loop does not work if useNativeDriver is true on web
                useNativeDriver: react_native_1.Platform.OS !== 'web',
                toValue: 1,
                isInteraction: false,
            });
        }
        if (animating) {
            startRotation();
        }
        else if (hidesWhenStopped) {
            // Hide indicator first and then stop rotation
            react_native_1.Animated.timing(fade, {
                duration: 200 * scale,
                toValue: 0,
                useNativeDriver: true,
                isInteraction: false,
            }).start(stopRotation);
        }
        else {
            stopRotation();
        }
    }, [animating, fade, hidesWhenStopped, startRotation, scale, timer]);
    var color = indicatorColor || ((_b = LightTheme_1.default.colors) === null || _b === void 0 ? void 0 : _b.primary);
    var size = typeof indicatorSize === 'string'
        ? indicatorSize === 'small'
            ? 24
            : 48
        : indicatorSize
            ? indicatorSize
            : 24;
    var frames = (60 * DURATION) / 1000;
    var easing = react_native_1.Easing.bezier(0.4, 0.0, 0.7, 1.0);
    var containerStyle = {
        width: size,
        height: size / 2,
        overflow: 'hidden',
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: [styles.container, style] }, rest, { accessible: true, accessibilityRole: "progressbar", accessibilityState: { busy: animating } }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: [{ width: size, height: size, opacity: fade }], collapsable: false }, { children: [0, 1].map(function (index) {
                // Thanks to https://github.com/n4kz/react-native-indicators for the great work
                var inputRange = Array.from(new Array(frames), function (_, frameIndex) { return frameIndex / (frames - 1); });
                var outputRange = Array.from(new Array(frames), function (_, frameIndex) {
                    var progress = (2 * frameIndex) / (frames - 1);
                    var rotation = index ? +(360 - 15) : -(180 - 15);
                    if (progress > 1.0) {
                        progress = 2.0 - progress;
                    }
                    var direction = index ? -1 : +1;
                    return "".concat(direction * (180 - 30) * easing(progress) + rotation, "deg");
                });
                var layerStyle = {
                    width: size,
                    height: size,
                    transform: [
                        {
                            rotate: timer.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["".concat(0 + 30 + 15, "deg"), "".concat(2 * 360 + 30 + 15, "deg")],
                            }),
                        },
                    ],
                };
                var viewportStyle = {
                    width: size,
                    height: size,
                    transform: [
                        {
                            translateY: index ? -size / 2 : 0,
                        },
                        {
                            rotate: timer.interpolate({ inputRange: inputRange, outputRange: outputRange }),
                        },
                    ],
                };
                var offsetStyle = index ? { top: size / 2 } : null;
                var lineStyle = {
                    width: size,
                    height: size,
                    borderColor: color,
                    borderWidth: size / 10,
                    borderRadius: size / 2,
                };
                return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: [styles.layer] }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: layerStyle }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: [containerStyle, offsetStyle], collapsable: false }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: viewportStyle }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, __assign({ style: containerStyle, collapsable: false }, { children: (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { style: lineStyle }) })) })) })) })) }), index));
            }) })) })));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    layer: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center' }),
});
exports.default = ActivityIndicator;
