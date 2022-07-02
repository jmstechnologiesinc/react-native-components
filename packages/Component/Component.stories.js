import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import {
  Button,
  Avatar,
  List,
  Badge,
  IconButton,
  Paragraph,
  Switch,
} from '@jmsstudiosinc/react-native-paper';

import {faCamera} from '@fortawesome/pro-light-svg-icons';
import {yellow600, black} from '../ReactNativePaper/styles/themes/v2/colors';

import useState from 'storybook-addon-state';

export default {
  title: 'packages/Component',
  component: Button,
};

export const TextButton = () => {
  const [visible, setVisible] = useState();

  return (
    <>
      {/* <ScrollView style={[styles.container]}>
      <View style={styles.row}>
        <Button onPress={() => {}} style={styles.button}>
          Default
        </Button>
        <Button buttonColor={'#ff0'} onPress={() => {}} style={styles.button}>
          Custom
        </Button>
        <Button disabled onPress={() => {}} style={styles.button}>
          Disabled
        </Button>
        <Button icon={faCamera} onPress={() => {}} style={styles.button}>
          Icon
        </Button>
        <Button loading onPress={() => {}} style={styles.button}>
          Loading
        </Button>
      </View>
    </ScrollView> */}

      {/* <ScrollView style={[styles.container, {backgroundColor: '#01579b'}]}>
      <List.Section title="Text">
        <View style={styles.row}>
          <Avatar.Text
            style={[styles.avatar, {backgroundColor: yellow600}]}
            label="XD"
            color={yellow600}
          />
          <Avatar.Text style={styles.avatar} label="XD" />
          <Avatar.Text style={styles.avatar} label="XD" size={80} />
        </View>
      </List.Section>
      <List.Section title="Icon">
        <View style={styles.row}>
          <Avatar.Icon
            style={[styles.avatar, {backgroundColor: yellow600}]}
            icon="folder"
            color={'#000'}
          />
          <Avatar.Icon style={styles.avatar} icon="folder" />
          <Avatar.Icon style={styles.avatar} icon="folder" size={80} />
        </View>
      </List.Section>
      <List.Section title="Image">
        <View style={styles.row}>
          <Avatar.Image
            style={styles.avatar}
            source={require('./images/avatar.png')}
          />
          <Avatar.Image
            style={styles.avatar}
            source={require('./images/avatar.png')}
            size={80}
          />
        </View>
      </List.Section>
    </ScrollView> */}

      <View style={[styles.container, {backgroundColor: '#fff'}]}>
        <View style={[styles.row, styles.item]}>
          <Paragraph style={styles.label}>Show badges</Paragraph>
          <Switch
            value={visible}
            onValueChange={visible => setVisible(visible)}
          />
        </View>
        <List.Section title="Text">
          <View style={styles.row}>
            <View style={styles.item}>
              <IconButton icon={faCamera} size={36} style={styles.button} />
              <Badge visible={visible} style={styles.badge}>
                12
              </Badge>
            </View>
            <View style={styles.item}>
              <IconButton icon={faCamera} size={36} style={styles.button} />
              <Badge
                visible={visible}
                style={[styles.badge, {backgroundColor: '#01579b'}]}
              >
                999+
              </Badge>
            </View>
          </View>
        </List.Section>
        <List.Section title="Dot">
          <View style={styles.row}>
            <View style={styles.item}>
              <IconButton icon={faCamera} size={36} style={styles.button} />
              <Badge visible={visible} style={styles.badge} size={8} />
            </View>
            <View style={styles.item}>
              <IconButton icon={faCamera} size={36} style={styles.button} />
              <Badge visible={visible} style={styles.badge} size={8} />
            </View>
          </View>
        </List.Section>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //   row: {
  //     flexDirection: 'row',
  //     flexWrap: 'wrap',
  //     paddingHorizontal: 12,
  //   },
  button: {
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    margin: 16,
  },
  button: {
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 0,
  },
  label: {
    flex: 1,
  },
});
