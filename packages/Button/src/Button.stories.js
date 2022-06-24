import React from 'react';
import { View,StyleSheet,ScrollView } from 'react-native';

import Button from './Button';
import theme from '../../ReactNativePaper/styles/themes/v2/LightTheme';

const {colors} = theme;

export default {
  title: 'packages/Button',
  component: Button,
};

export const TextButton = () => (
  <ScrollView
  style={[styles.container]}
>
  <View style={styles.row}>
    <Button onPress={() => {}} style={styles.button}>
      Default
    </Button>
    <Button
      buttonColor={colors.accent}
      onPress={() => {}}
      style={styles.button}
    >
      Custom
    </Button>
    <Button disabled onPress={() => {}} style={styles.button}>
      Disabled
    </Button>
    <Button icon="camera" onPress={() => {}} style={styles.button}>
      Icon
    </Button>
    <Button loading onPress={() => {}} style={styles.button}>
      Loading
    </Button>
  </View>
  </ScrollView>
);


export const OutlinedButton = () => (
  <ScrollView
  style={[styles.container]}
>
  <View style={styles.row}> 
    <Button mode="outlined" onPress={() => {}} style={styles.button}>
      Default
    </Button>
    <Button
      mode="outlined"
      buttonColor={colors.accent}
      onPress={() => {}}
      style={styles.button}
    >
      Custom
    </Button>
    <Button
      mode="outlined"
      disabled
      onPress={() => {}}
      style={styles.button}
    >
      Disabled
    </Button>
    <Button
      mode="outlined"
      icon="camera"
      onPress={() => {}}
      style={styles.button}
    >
      Icon
    </Button>
    <Button
      mode="outlined"
      loading
      onPress={() => {}}
      style={styles.button}
    >
      Loading
    </Button>
    <Button
      mode="outlined"
      onPress={() => {}}
      style={styles.button}
      labelStyle={{
        fontWeight: '800',
        fontSize: 18,
      }}
    >
      Custom Font
    </Button>
    </View>
  </ScrollView>
);

export const ContainedButton = () => (
  <ScrollView
  style={[styles.container]}
>
  <View style={styles.row}>
    <Button mode="contained" onPress={() => {}} style={styles.button}>
      Default
    </Button>
    <Button
      mode="contained"
      buttonColor={colors.accent}
      onPress={() => {}}
      style={styles.button}
    >
      Custom
    </Button>
    <Button
      mode="contained"
      disabled
      onPress={() => {}}
      style={styles.button}
    >
      Disabled
    </Button>
    <Button
      mode="contained"
      icon="camera"
      onPress={() => {}}
      style={styles.button}
    >
      Icon
    </Button>
    <Button
      mode="contained"
      loading
      onPress={() => {}}
      style={styles.button}
    >
      Loading
    </Button>
    </View>
  </ScrollView>
);

export const CustomIcon = () => (
  <ScrollView
  style={[styles.container]}
>
  <View style={styles.row}>
    <Button
      mode="outlined"
      icon={{
        uri:
          'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400',
      }}
      onPress={() => {}}
      style={styles.button}
    >
      Remote image
    </Button>
  {/*   <Button
      mode="outlined"
      icon={require('../../assets/images/favorite.png')}
      onPress={() => {}}
      style={styles.button}
    >
      Required asset
    </Button> */}
  {/*   <Button
      mode="outlined"
      icon={({ size }) => (
        <Image
          source={require('../../assets/images/chameleon.jpg')}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      )}
      onPress={() => {}}
      style={styles.button}
    >
      Custom component
    </Button> */}
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




