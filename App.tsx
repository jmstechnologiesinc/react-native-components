import React from 'react';
import {LogBox, StyleSheet, Text, View} from 'react-native';
import ENV from 'react-native-config';
import {STORYBOOK_ENABLED} from 'react-native-dotenv';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

let AppEntryPoint = App;

if (STORYBOOK_ENABLED) {
  LogBox.ignoreAllLogs();
  AppEntryPoint = require('./.ondevice').default;
}

export default AppEntryPoint;
