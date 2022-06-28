"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var MD2Colors = __importStar(require("./v2/colors"));
var react_native_1 = require("react-native");
var tokens_1 = require("./tokens");
var SHADOW_COLOR = MD2Colors.black;
var SHADOW_OPACITY = 0.24;
var MD3_SHADOW_OPACITY = 0.3;
var MD3_SHADOW_COLOR = tokens_1.MD3Colors.primary0;
function shadow(elevation, isV3) {
    if (elevation === void 0) { elevation = 0; }
    if (isV3 === void 0) { isV3 = false; }
    return isV3 ? v3Shadow(elevation) : v2Shadow(elevation);
}
exports.default = shadow;
function v2Shadow(elevation) {
    if (elevation === void 0) { elevation = 0; }
    if (elevation instanceof react_native_1.Animated.Value) {
        var inputRange = [0, 1, 2, 3, 8, 24];
        return {
            shadowColor: SHADOW_COLOR,
            shadowOffset: {
                width: new react_native_1.Animated.Value(0),
                height: elevation.interpolate({
                    inputRange: inputRange,
                    outputRange: [0, 0.5, 0.75, 2, 7, 23],
                }),
            },
            shadowOpacity: elevation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, SHADOW_OPACITY],
                extrapolate: 'clamp',
            }),
            shadowRadius: elevation.interpolate({
                inputRange: inputRange,
                outputRange: [0, 0.75, 1.5, 3, 8, 24],
            }),
        };
    }
    else {
        if (elevation === 0) {
            return {};
        }
        var height = void 0, radius = void 0;
        switch (elevation) {
            case 1:
                height = 0.5;
                radius = 0.75;
                break;
            case 2:
                height = 0.75;
                radius = 1.5;
                break;
            default:
                height = elevation - 1;
                radius = elevation;
        }
        return {
            shadowColor: SHADOW_COLOR,
            shadowOffset: {
                width: 0,
                height: height,
            },
            shadowOpacity: SHADOW_OPACITY,
            shadowRadius: radius,
        };
    }
}
function v3Shadow(elevation) {
    if (elevation === void 0) { elevation = 0; }
    var inputRange = [0, 1, 2, 3, 4, 5];
    var shadowHeight = [0, 1, 2, 4, 6, 8];
    var shadowRadius = [0, 3, 6, 8, 10, 12];
    if (elevation instanceof react_native_1.Animated.Value) {
        return {
            shadowColor: MD3_SHADOW_COLOR,
            shadowOffset: {
                width: new react_native_1.Animated.Value(0),
                height: elevation.interpolate({
                    inputRange: inputRange,
                    outputRange: shadowHeight,
                }),
            },
            shadowOpacity: elevation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, MD3_SHADOW_OPACITY],
                extrapolate: 'clamp',
            }),
            shadowRadius: elevation.interpolate({
                inputRange: inputRange,
                outputRange: shadowRadius,
            }),
        };
    }
    else {
        return {
            shadowColor: MD3_SHADOW_COLOR,
            shadowOpacity: elevation ? MD3_SHADOW_OPACITY : 0,
            shadowOffset: {
                width: 0,
                height: shadowHeight[elevation],
            },
            shadowRadius: shadowRadius[elevation],
        };
    }
}
