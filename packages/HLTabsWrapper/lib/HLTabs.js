import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './styles';

const HLTabs = ({options, value, onSelect}) => {
  const renderTabItem = (option, index) => {
    const onPress = () => onSelect?.(option.value);

    const isSelected = option.value === value;

    return (
      <View key={index} style={styles.tabItemContainer}>
        <TouchableOpacity
          testID="filterButton"
          style={[
            styles.touchContainer,
            {
              backgroundColor: isSelected ? '#281a62' : '#eeeeee',
            },
          ]}
          disabled={isSelected ? true : false}
          onPress={onPress}
        >
          <Text
            testID="optionTitle"
            style={{
              color: isSelected ? '#ffffff' : '#000',
              fontWeight: 'bold',
            }}
          >
            {option.title}
          </Text>
          {option?.description && <Text>{option?.description}</Text>}
        </TouchableOpacity>
      </View>
    );
  };

  return <View style={styles.tabContainer}>{options.map(renderTabItem)}</View>;
};

export default HLTabs;
