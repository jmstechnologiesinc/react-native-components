import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';

import useState from 'storybook-addon-state';

import {ActivityIndicator, FAB} from '@jmsstudiosinc/react-native-paper';
import {faPause, faPlay} from '@fortawesome/pro-regular-svg-icons';

export default {
  title: 'Component/ActivityIndicator',
  component: ActivityIndicator,
};

export const ActivityIndicators = () => {
  const [animating, setAnimating] = useState();

  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      <View style={styles.row}>
        <FAB
          small
          icon={animating ? faPause : faPlay}
          onPress={() => setAnimating(!animating)}
        />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} hidesWhenStopped={false} />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} size="large" />
      </View>

      <View style={styles.row}>
        <ActivityIndicator animating={animating} color={'#ff0'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },

  row: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
});
