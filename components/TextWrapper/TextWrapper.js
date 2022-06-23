//https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTypography.js
//https://mui.com/material-ui/react-typography/
import React from 'react';
import {
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import normalize from '../helpers/normalizeText';

function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

const caseAllCaps = {
  textTransform: 'uppercase',
};

const defaultFontFamily = 'Roboto';

const fontFamily = defaultFontFamily;
const fontWeightLight = '300';
const fontWeightRegular = '400';
const fontWeightMedium = '500';

const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => ({
  ...( Platform.OS === 'android' && { fontFamily }),
  fontWeight,
  fontSize: normalize(size),
  //lineHeight,
  // The letter spacing was designed for the Roboto font-family. Using the same letter-spacing
  // across font-families can cause issues with the kerning.
  ...(fontFamily === defaultFontFamily
    ? { letterSpacing: round(letterSpacing / size) }
    : {}),
  ...casing,
});

const variants = {
  h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
  h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
  h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
  h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
  h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
  h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
  subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
  subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
  body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
  body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
  button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
  caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
  overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
};
console.log(JSON.stringify(variants, null, 2))

export const TextWrapper = ({
  style,
  variant= "body1",
  children = '',
  ...rest
}) => {
  return (
    <Text
      accessibilityRole="text"
      style={StyleSheet.flatten([
        style,
       variants[variant]
      ])}
      {...rest}
    >
      {children}
    </Text>
  );
};

TextWrapper.displayName = 'TextWrapper';

/* TextWrapper.prototype = {
  variant: PropTypes.oneOfType([
    PropTypes.oneOf([
      'body1',
      'body2',
      'button',
      'caption',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'inherit',
      'overline',
      'subtitle1',
      'subtitle2',
    ]),
    PropTypes.string,
  ])
}
 */