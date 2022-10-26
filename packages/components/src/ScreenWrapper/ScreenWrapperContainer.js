import * as React from 'react';
import { View} from 'react-native';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const containerPaddings = {
  top: MD3LightTheme.margin / 2,
  bottom: MD3LightTheme.margin,
  left: MD3LightTheme.margin,
  right: MD3LightTheme.margin
}

export const ScreenWrapperContainer = ({
  withPaddingVertical = true,
  withPaddingHorizontal = true,
  paddingTop = containerPaddings.top,
  paddingBottom = containerPaddings.bottom,
  paddingLeft = containerPaddings.left,
  paddingRight = containerPaddings.right,
  style,
  children
}) => (
  <View style={[{
    flex: 1, 
    ...(withPaddingVertical && { paddingTop, paddingBottom }), 
    ...(withPaddingHorizontal && { paddingLeft, paddingRight })
    }, style]}>
    {children}
  </View>
)

export {containerPaddings}

export default ScreenWrapperContainer