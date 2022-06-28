import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import FAB from './Fab';

export default {
  title: 'packages/FAB',
  component: FAB,
};

export const Fabs = () => (
  <View style={styles.row}>
    <FAB icon="heart" style={styles.fab} onPress={() => {}} visible={true} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  row: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fab: {
    margin: 8,
  },
  fabVariant: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
