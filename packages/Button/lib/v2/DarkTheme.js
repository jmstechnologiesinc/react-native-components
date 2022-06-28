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
var color_1 = __importDefault(require("color"));
var LightTheme_1 = __importDefault(require("./LightTheme"));
var colors_1 = require("./colors");
var fonts_1 = __importDefault(require("../fonts"));
var DarkTheme = __assign(__assign({}, LightTheme_1.default), { dark: true, mode: 'adaptive', version: 2, isV3: false, colors: __assign(__assign({}, LightTheme_1.default.colors), { primary: '#BB86FC', accent: '#03dac6', background: '#121212', surface: '#121212', error: '#CF6679', onSurface: '#FFFFFF', text: colors_1.white, disabled: (0, color_1.default)(colors_1.white).alpha(0.38).rgb().string(), placeholder: (0, color_1.default)(colors_1.white).alpha(0.54).rgb().string(), backdrop: (0, color_1.default)(colors_1.black).alpha(0.5).rgb().string(), notification: colors_1.pinkA100 }), fonts: (0, fonts_1.default)() });
exports.default = DarkTheme;
