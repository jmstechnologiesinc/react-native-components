import React from 'react';
import {View} from 'react-native';

import {Button} from '@jmsstudiosinc/react-native-paper';
import styles from './styles';

const HLTabs = ({options, value, onSelect}) => {
  const renderTabItem = option => {
    const onPress = () => onSelect?.(option.value);

    const isSelected = option.value === value;

    return (
      <Button
        mode={isSelected ? 'contained' : 'contained-tonal'}
        onPress={onPress}
        contentStyle={styles.button}>
        {option.title}
      </Button>
    );
  };

  return <View style={styles.tabContainer}>{options.map(renderTabItem)}</View>;
};

export default HLTabs;
