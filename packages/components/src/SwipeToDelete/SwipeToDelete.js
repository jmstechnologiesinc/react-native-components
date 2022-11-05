import React from 'react';

import {View} from 'react-native';

import RNSwipeable from 'react-native-gesture-handler/Swipeable';
import { MD3LightTheme, Text} from '@jmsstudiosinc/react-native-paper';

const rightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: MD3LightTheme.colors.error,
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}>
      <Text
        variant="labelLarge"
        style={{
          color: MD3LightTheme.colors.onError,
          paddingHorizontal: 24,
        }} >
        Delete
      </Text>
    </View>
  );
};

const Swipeable = ({children, onSwipeableRightOpen}) => (
  <RNSwipeable
    renderRightActions={rightSwipeActions}
    onSwipeableRightOpen={onSwipeableRightOpen}>
    <View style={{backgroundColor: MD3LightTheme.colors.background, flex: 1}}>
      {children}
    </View>
  </RNSwipeable>
);
export default Swipeable;