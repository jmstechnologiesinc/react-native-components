import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenWrapper({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  ...rest
}) {

  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: MD3LightTheme.colors.background,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.left,
    },
  ];

  return (
    <>
      {withScrollView ? (
        <View style={containerStyle}>
          <ScrollView
            {...rest}
            contentContainerStyle={contentContainerStyle}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      ) : <View style={[containerStyle, style]}>{children}</View>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
