import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

import useState from 'storybook-addon-state';

import {FIELD_TYPES} from '@jmsstudiosinc/commons';
import {
  Paragraph,
  Checkbox,
  TouchableRipple,
} from '@jmsstudiosinc/react-native-paper';

const renderCheckboxRadio = item => {
  const [checkedNormal, setCheckedNormal] = useState(true);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#fff',
        },
      ]}>
      <TouchableRipple onPress={() => setCheckedNormal(!checkedNormal)}>
        <View style={styles.row}>
          <Paragraph>{item.title}</Paragraph>
          <View pointerEvents="none">
            <Checkbox
              status={checkedNormal ? 'checked' : 'unchecked'}
              type={item.type}
              disabled={item.isDisabled}
            />
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
