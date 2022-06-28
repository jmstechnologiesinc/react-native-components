"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = __importDefault(require("color"));
var colors_1 = require("./colors");
var fonts_1 = __importDefault(require("../fonts"));
var LightTheme = {
    dark: false,
    roundness: 4,
    version: 2,
    isV3: false,
    colors: {
        primary: '#6200ee',
        accent: '#03dac4',
        background: '#f6f6f6',
        surface: colors_1.white,
        error: '#B00020',
        text: colors_1.black,
        onSurface: '#000000',
        disabled: (0, color_1.default)(colors_1.black).alpha(0.26).rgb().string(),
        placeholder: (0, color_1.default)(colors_1.black).alpha(0.54).rgb().string(),
        backdrop: (0, color_1.default)(colors_1.black).alpha(0.5).rgb().string(),
        notification: colors_1.pinkA400,
    },
    fonts: (0, fonts_1.default)(),
    animation: {
        scale: 1.0,
    },
};
exports.default = LightTheme;
