"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Checkbox_1 = __importDefault(require("./Checkbox"));
var CheckboxItem_1 = __importDefault(require("./CheckboxItem"));
var CheckboxAndroid_1 = __importDefault(require("./CheckboxAndroid"));
var CheckboxIOS_1 = __importDefault(require("./CheckboxIOS"));
var Checkbox = Object.assign(
// @component ./Checkbox.tsx
Checkbox_1.default, {
    // @component ./CheckboxItem.tsx
    Item: CheckboxItem_1.default,
    // @component ./CheckboxAndroid.tsx
    Android: CheckboxAndroid_1.default,
    // @component ./CheckboxIOS.tsx
    IOS: CheckboxIOS_1.default,
});
exports.default = Checkbox;
