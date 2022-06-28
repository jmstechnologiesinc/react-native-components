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
var utils_1 = require("./utils");
var LightTheme_1 = __importDefault(require("../LightTheme"));
/**
 * A wrapper for views that should respond to touches.
 * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
 * On unsupported platforms, it falls back to a highlight effect.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/touchable-ripple.gif" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Text, TouchableRipple } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TouchableRipple
 *     onPress={() => console.log('Pressed')}
 *     rippleColor="rgba(0, 0, 0, .32)"
 *   >
 *     <Text>Press anywhere</Text>
 *   </TouchableRipple>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableWithoutFeedback props https://reactnative.dev/docs/touchablewithoutfeedback#props
 */
var TouchableRipple = function (_a) {
    var style = _a.style, _background = _a.background, _b = _a.borderless, borderless = _b === void 0 ? false : _b, disabledProp = _a.disabled, rippleColor = _a.rippleColor, _underlayColor = _a.underlayColor, children = _a.children, rest = __rest(_a, ["style", "background", "borderless", "disabled", "rippleColor", "underlayColor", "children"]);
    var handlePressIn = function (e) {
        var _a, _b, _c;
        var centered = rest.centered, onPressIn = rest.onPressIn;
        onPressIn === null || onPressIn === void 0 ? void 0 : onPressIn(e);
        var calculatedRippleColor = (0, utils_1.getTouchableRippleColors)({
            theme: LightTheme_1.default,
            rippleColor: rippleColor,
        }).calculatedRippleColor;
        var button = e.currentTarget;
        var style = window.getComputedStyle(button);
        var dimensions = button.getBoundingClientRect();
        var touchX;
        var touchY;
        var _d = e.nativeEvent, changedTouches = _d.changedTouches, touches = _d.touches;
        var touch = (_a = touches === null || touches === void 0 ? void 0 : touches[0]) !== null && _a !== void 0 ? _a : changedTouches === null || changedTouches === void 0 ? void 0 : changedTouches[0];
        // If centered or it was pressed using keyboard - enter or space
        if (centered || !touch) {
            touchX = dimensions.width / 2;
            touchY = dimensions.height / 2;
        }
        else {
            touchX = (_b = touch.locationX) !== null && _b !== void 0 ? _b : e.pageX;
            touchY = (_c = touch.locationY) !== null && _c !== void 0 ? _c : e.pageY;
        }
        // Get the size of the button to determine how big the ripple should be
        var size = centered
            ? // If ripple is always centered, we don't need to make it too big
                Math.min(dimensions.width, dimensions.height) * 1.25
            : // Otherwise make it twice as big so clicking on one end spreads ripple to other
                Math.max(dimensions.width, dimensions.height) * 2;
        // Create a container for our ripple effect so we don't need to change the parent's style
        var container = document.createElement('span');
        container.setAttribute('data-paper-ripple', '');
        Object.assign(container.style, {
            position: 'absolute',
            pointerEvents: 'none',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            borderTopLeftRadius: style.borderTopLeftRadius,
            borderTopRightRadius: style.borderTopRightRadius,
            borderBottomRightRadius: style.borderBottomRightRadius,
            borderBottomLeftRadius: style.borderBottomLeftRadius,
            overflow: centered ? 'visible' : 'hidden',
        });
        // Create span to show the ripple effect
        var ripple = document.createElement('span');
        Object.assign(ripple.style, {
            position: 'absolute',
            pointerEvents: 'none',
            backgroundColor: calculatedRippleColor,
            borderRadius: '50%',
            /* Transition configuration */
            transitionProperty: 'transform opacity',
            transitionDuration: "".concat(Math.min(size * 1.5, 350), "ms"),
            transitionTimingFunction: 'linear',
            transformOrigin: 'center',
            /* We'll animate these properties */
            transform: 'translate3d(-50%, -50%, 0) scale3d(0.1, 0.1, 0.1)',
            opacity: '0.5',
            // Position the ripple where cursor was
            left: "".concat(touchX, "px"),
            top: "".concat(touchY, "px"),
            width: "".concat(size, "px"),
            height: "".concat(size, "px"),
        });
        // Finally, append it to DOM
        container.appendChild(ripple);
        button.appendChild(container);
        // rAF runs in the same frame as the event handler
        // Use double rAF to ensure the transition class is added in next frame
        // This will make sure that the transition animation is triggered
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                Object.assign(ripple.style, {
                    transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
                    opacity: '1',
                });
            });
        });
    };
    var handlePressOut = function (e) {
        var _a;
        (_a = rest.onPressOut) === null || _a === void 0 ? void 0 : _a.call(rest, e);
        var containers = e.currentTarget.querySelectorAll('[data-paper-ripple]');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                containers.forEach(function (container) {
                    var ripple = container.firstChild;
                    Object.assign(ripple.style, {
                        transitionDuration: '250ms',
                        opacity: 0,
                    });
                    // Finally remove the span after the transition
                    setTimeout(function () {
                        var parentNode = container.parentNode;
                        if (parentNode) {
                            parentNode.removeChild(container);
                        }
                    }, 500);
                });
            });
        });
    };
    var disabled = disabledProp || !rest.onPress;
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableWithoutFeedback, __assign({}, rest, { onPressIn: handlePressIn, onPressOut: handlePressOut, disabled: disabled }, { children: (0, jsx_runtime_1.jsx)(react_native_1.View, __assign({ style: [styles.touchable, borderless && styles.borderless, style] }, { children: React.Children.only(children) })) })));
};
/**
 * Whether ripple effect is supported.
 */
TouchableRipple.supported = true;
var styles = react_native_1.StyleSheet.create({
    touchable: __assign({ position: 'relative' }, (react_native_1.Platform.OS === 'web' && { cursor: 'pointer' })),
    borderless: {
        overflow: 'hidden',
    },
});
exports.default = TouchableRipple;
