import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import {Button, Checkbox, IconButton} from '@jmsstudiosinc/react-native-paper';

import {faCamera} from '@fortawesome/pro-light-svg-icons';

export default {
  title: 'packages/Button',
  component: Button,
};
const checkedCustom = true;
export const Buttons = () => (
  <ScrollView style={[styles.container]}>
    <View style={styles.row}>
      <Button onPress={() => {}} style={styles.button}>
        Default
      </Button>
      <Button buttonColor={'#ffdd'} onPress={() => {}} style={styles.button}>
        Custom
      </Button>
      <Button disabled onPress={() => {}} style={styles.button}>
        Disabled
      </Button>
      <Button
        mode="elevated"
        icon={faCamera}
        onPress={() => {}}
        style={styles.button}
      >
        Icon
      </Button>
      <Button loading onPress={() => {}} style={styles.button}>
        Loading
      </Button>
      <View>
        <Checkbox
          color={'#f00'}
          status={checkedCustom ? 'checked' : 'unchecked'}
        />
        <IconButton
          icon={faCamera}
          size={36}
          color={'#00ff'}
          onPress={() => {}}
        />
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  button: {
    margin: 4,
  },
});
