import { Platform } from "react-native";
import CombinedStyleSheet from "../internal/CombinedStyleSheet";
import suffixProperties from "../internal/suffixProperties";
import systemWeights from "../helpers/systemWeights";
import sanFranciscoSpacing from "../helpers/sanFranciscoSpacing";
import materialColors from "../helpers/materialColors";

// https://material.io/guidelines/style/typography.html#typography-styles
//https://material.io/archive/guidelines/style/typography.html#typography-styles
//https://en.wikipedia.org/wiki/Leading
//http://www.pearsonified.com/typography/
//https://www.smashingmagazine.com/2011/11/the-perfect-paragraph/

const colors = {
  black: {
    primary: materialColors.blackPrimary,
    secondary: materialColors.blackSecondary,
    tertiary: materialColors.blackTertiary
  },
  white: {
    primary: materialColors.whitePrimary,
    secondary: materialColors.whiteSecondary,
    tertiary: materialColors.whiteTertiary
  }
};

const getStylesForColor = color => ({
  headline1: {
    fontSize: 96,
   // lineHeight: 32,
    ...systemWeights.light,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(96) : undefined,
    color: colors[color].primary
  },
  headline2: {
    fontSize: 60,
   // lineHeight: 32,
    ...systemWeights.light,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(60) : undefined,
    color: colors[color].primary
  },
  headline3: {
    fontSize: 48,
   // lineHeight: 32,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(48) : undefined,
    color: colors[color].primary
  },
  headline4: {
    fontSize: 34,
    lineHeight: 40,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(34) : undefined,
    color: colors[color].primary
  },
  headline5: {
    fontSize: 20,
   // lineHeight: 32,
    ...systemWeights.me,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(20) : undefined,
    color: colors[color].primary
  },
  headline6: {
    fontSize: 24,
    lineHeight: 32,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(24) : undefined,
    color: colors[color].primary
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 20,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(16) : undefined,
    color: colors[color].primary
  },
  subtitle2: {
    fontSize: 14,
   // lineHeight: 32,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(14) : undefined,
    color: colors[color].primary
  },
  body1: {
    fontSize: 16,
    lineHeight: 20,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(16) : undefined,
    color: colors[color].primary
  },
  body2: {
    fontSize: 14,
    //lineHeight: 24,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(14) : undefined,
    color: colors[color].primary
  },
  button: {
    fontSize: 14,
    lineHeight: 20,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(14) : undefined,
    color: colors[color].primary
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(12) : undefined,
    color: colors[color].secondary
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(10) : undefined,
    color: colors[color].secondary
  },
  display4: {
    fontSize: 112,
    lineHeight: 128,
    ...systemWeights.light,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(112) : undefined,
    color: colors[color].secondary
  },
  display3: {
    fontSize: 56,
    lineHeight: 64,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(56) : undefined,
    color: colors[color].secondary
  },
  display2: {
    fontSize: 45,
    lineHeight: 52,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(45) : undefined,
    color: colors[color].secondary
  },
  display1: {
    fontSize: 34,
    lineHeight: 40,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(34) : undefined,
    color: colors[color].secondary
  },
  headline: {
    fontSize: 24,
    lineHeight: 32,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(24) : undefined,
    color: colors[color].primary
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    ...systemWeights.semibold,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(20) : undefined,
    color: colors[color].primary
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    ...systemWeights.regular,
    letterSpacing: Platform.OS === "ios" ? sanFranciscoSpacing(16) : undefined,
    color: colors[color].primary
  },
});

export default CombinedStyleSheet.create({
  ...getStylesForColor("black"),
  ...suffixProperties(getStylesForColor("white"), "White")
});
