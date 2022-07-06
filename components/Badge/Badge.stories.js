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

import useState from 'storybook-addon-state';

export default {
  title: 'Component/Badge',
  component: Badge,
};

export const Badges = () => {
  const [visible, setVisible] = useState();

  return (
    <>
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
