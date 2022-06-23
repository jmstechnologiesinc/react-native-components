//https://github.com/mui/material-ui/blob/master/packages/mui-material/src/styles/createTypography.js
//https://mui.com/material-ui/react-typography/
import React from 'react';
import {
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

import {material} from ".";

const platformDesignSystem = material;

const Typography = ({
  style,
  variant= "h1",
  children = '',
  ...rest
}) => {
  return (
    <Text
      accessibilityRole="text"
      style={StyleSheet.flatten([
        style,
        platformDesignSystem[variant]
      ])}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default Typography