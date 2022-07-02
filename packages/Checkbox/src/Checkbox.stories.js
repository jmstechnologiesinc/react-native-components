import React from 'react';
import {View, StyleSheet} from 'react-native';

import {Checkbox} from '@jmsstudiosinc/react-native-paper';
import useState from 'storybook-addon-state';
import TouchableRipple from './TouchableRipple/TouchableRipple';
import Paragraph from './Text';

export default {
  title: 'packages/Checkbox',
  component: Checkbox,
};

export const Checkboxs = () => {
  const [checkedNormal, setCheckedNormal] = useState();
  const [checkedCustom, setCheckedCustom] = useState();
  const [indeterminate, setIndeterminate] = useState();
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
          <Paragraph>Normal</Paragraph>
          <View pointerEvents="none">
            <Checkbox status={checkedNormal ? 'checked' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setCheckedCustom(!checkedCustom)}>
        <View style={styles.row}>
          <Paragraph>Custom</Paragraph>
          <View pointerEvents="none">
            <Checkbox
              color={'#f00'}
              status={checkedCustom ? 'checked' : 'unchecked'}
            />
          </View>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={() => setIndeterminate(!indeterminate)}>
        <View style={styles.row}>
          <Paragraph>Indeterminate</Paragraph>
          <View pointerEvents="none">
            <Checkbox status={indeterminate ? 'indeterminate' : 'unchecked'} />
          </View>
        </View>
      </TouchableRipple>

      <View style={styles.row}>
        <Paragraph>Checked (Disabled)</Paragraph>
        <Checkbox status="checked" disabled />
      </View>
      <View style={styles.row}>
        <Paragraph>Unchecked (Disabled)</Paragraph>
        <Checkbox status="unchecked" disabled />
      </View>
      <View style={styles.row}>
        <Paragraph>Indeterminate (Disabled)</Paragraph>
        <Checkbox status="indeterminate" disabled />
      </View>
    </View>
  );
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
