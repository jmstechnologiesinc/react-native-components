import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import AnimatedText from '../../Typography/AnimatedText';
import { useTheme } from '../../../core/theming';

import type { InputLabelProps } from '../types';

const InputLabel = (props: InputLabelProps) => {
  const { isV3 } = useTheme();
  const { parentState, labelBackground, mode } = props;
  const {
    label,
    error,
    onLayoutAnimatedText,
    hasActiveOutline,
    activeColor,
    placeholderStyle,
    baseLabelTranslateX,
    baseLabelTranslateY,
    font,
    fontSize,
    fontWeight,
    placeholderOpacity,
    wiggleOffsetX,
    labelScale,
    topPosition,
    paddingOffset,
    placeholderColor,
    errorColor,
    labelTranslationXOffset,
    maxFontSizeMultiplier,
  } = props.labelProps;

  const labelTranslationX = {
    transform: [
      {
        // Offset label scale since RN doesn't support transform origin
        translateX: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [baseLabelTranslateX, labelTranslationXOffset || 0],
        }),
      },
    ],
  };

  const labelStyle = {
    ...font,
    fontSize,
    fontWeight,
    transform: [
      {
        // Wiggle the label when there's an error
        translateX: parentState.error.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, parentState.value && error ? wiggleOffsetX : 0, 0],
        }),
      },
      {
        // Move label to top
        translateY: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [baseLabelTranslateY, 0],
        }),
      },
      {
        // Make label smaller
        scale: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [labelScale, 1],
        }),
      },
    ],
  };

  let textColor = placeholderColor;

  if (error && errorColor) {
    textColor = errorColor;
  }
  if (isV3 && parentState.value && mode !== 'outlined') {
    textColor = activeColor;
  }

  return label ? (
    // Position colored placeholder and gray placeholder on top of each other and crossfade them
    // This gives the effect of animating the color, but allows us to use native driver
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.labelContainer,
        {
          opacity:
            // Hide the label in minimized state until we measure it's width
            parentState.value || parentState.focused
              ? parentState.labelLayout.measured
                ? 1
                : 0
              : 1,
        },
        labelTranslationX,
      ]}
    >
      {labelBackground?.({
        parentState,
        labelStyle,
        labelProps: props.labelProps,
        maxFontSizeMultiplier: maxFontSizeMultiplier,
      })}
      <AnimatedText
        variant="bodySmall"
        onLayout={onLayoutAnimatedText}
        style={[
          placeholderStyle,
          {
            top: topPosition,
          },
          labelStyle,
          paddingOffset || {},
          {
            color: activeColor,
            opacity: parentState.labeled.interpolate({
              inputRange: [0, 1],
              outputRange: [hasActiveOutline ? 1 : 0, 0],
            }),
          },
          isV3 && styles.md3TextLine,
        ]}
        numberOfLines={1}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {label}
      </AnimatedText>
      <AnimatedText
        variant={parentState.focused ? 'bodyLarge' : 'bodySmall'}
        style={[
          placeholderStyle,
          {
            top: topPosition,
          },
          labelStyle,
          paddingOffset,
          {
            color: textColor,
            opacity: placeholderOpacity,
          },
          isV3 && styles.md3TextLine,
        ]}
        numberOfLines={1}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {label}
      </AnimatedText>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  labelContainer: {
    zIndex: 3,
  },
  md3TextLine: {
    lineHeight: undefined,
  },
});

export default InputLabel;