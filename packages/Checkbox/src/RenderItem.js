import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FIELD_TYPES} from '@jmsstudiosinc/commons';
import {
  Paragraph,
  Checkbox,
  TouchableRipple,
} from '@jmsstudiosinc/react-native-paper';

const renderCheckboxRadio = item => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#fff',
        },
      ]}>
      <TouchableRipple onPress={() => console.log('hey')}>
        <View style={styles.row}>
          <Paragraph>{item.title}</Paragraph>
          <View pointerEvents="none">
            <Checkbox status={'checked'} />
          </View>
        </View>
      </TouchableRipple>
    </View>
  );
};

const renderField = (item, section) => {
  switch (item.type) {
    case FIELD_TYPES.radio:
    case FIELD_TYPES.checkbox:
      return renderCheckboxRadio(item, section);
    default:
      return (
        <Text>
          {item.title} - {item.type}
        </Text>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default renderField;
