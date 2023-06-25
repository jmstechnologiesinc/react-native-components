import React from 'react';

import {View} from "react-native"
import QuantityButton from './QuantityButton';

import useState from 'storybook-addon-state';
import { IconButton, Text } from '@jmstechnologiesinc/react-native-paper';

export default {
  title: 'packages/QuantityButton',
};

export const Basic = () => {
  const [value, setValue] = useState(0);

  return <QuantityButton value={value} onPress={setValue} />
}

export const Basic1 = () => {

  return <View style={{flex: 1,flexDirection: "row", justifyContent: 'space-around', alignItems: 'center'}}>
    <IconButton icon="minus-circle" />
    <Text>4</Text>
    <IconButton icon="plus-circle" />
  </View>
}