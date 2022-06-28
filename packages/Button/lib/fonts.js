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
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var fontConfig = {
    web: {
        regular: {
            fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: '400',
        },
        medium: {
            fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: '500',
        },
        light: {
            fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: '300',
        },
        thin: {
            fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: '100',
        },
    },
    ios: {
        regular: {
            fontFamily: 'System',
            fontWeight: '400',
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500',
        },
        light: {
            fontFamily: 'System',
            fontWeight: '300',
        },
        thin: {
            fontFamily: 'System',
            fontWeight: '100',
        },
    },
    default: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'sans-serif-light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'sans-serif-thin',
            fontWeight: 'normal',
        },
    },
};
function configureFonts(config) {
    var fonts = react_native_1.Platform.select(__assign(__assign({}, fontConfig), config));
    return fonts;
}
exports.default = configureFonts;
