import React from 'react';
import {View, StyleSheet, ScrollView, Image, Text} from 'react-native';
import {
  faWallet,
  faCalendar,
  faFolder,
  faEquals,
  faStarShooting,
} from '@fortawesome/pro-regular-svg-icons';

import {List, Chip} from '@jmsstudiosinc/react-native-paper';

export default {
  title: 'Component/List.Section',
};

export const SingleLine = () => (
  <ScrollView>
    <List.Section>
      <List.Subheader>Single line</List.Subheader>
      <List.Item
        left={props => <List.Icon {...props} icon={faCalendar} />}
        title="List item 1"
      />
      <List.Item
        left={props => <List.Icon {...props} icon={faWallet} />}
        title="List item 2"
      />
      <List.Item
        title="List item 3"
        left={props => <List.Icon {...props} icon={faFolder} />}
        right={props => <List.Icon {...props} icon={faEquals} />}
      />
    </List.Section>
  </ScrollView>
);

export const TwoLine = () => (
  <ScrollView>
    <List.Section>
      <List.Subheader>Two line</List.Subheader>
      <List.Item
        left={() => (
          <Image source={require('./email-icon.png')} style={styles.image} />
        )}
        title="List item 1"
        description="Describes item 1"
      />
      <List.Item
        left={() => (
          <Image source={require('./email-icon.png')} style={styles.image} />
        )}
        right={props => <List.Icon {...props} icon={faStarShooting} />}
        title="List item 2"
        description="Describes item 2"
      />
    </List.Section>
  </ScrollView>
);

export const ThreeLine = () => (
  <ScrollView>
    <List.Section>
      <List.Subheader>Three line</List.Subheader>
      <List.Item
        left={() => (
          <Image source={require('./email-icon.png')} style={styles.image} />
        )}
        title="List item 1"
        description="Describes item 1. Example of a very very long description."
      />
      <List.Item
        left={() => (
          <Image source={require('./email-icon.png')} style={styles.image} />
        )}
        right={props => <List.Icon {...props} icon={faStarShooting} />}
        title="List item 2"
        description="Describes item 2. Example of a very very long description."
      />
    </List.Section>
  </ScrollView>
);

export const CustomDescription = () => (
  <ScrollView>
    <List.Section>
      <List.Subheader>Custom description</List.Subheader>
      <List.Item
        left={() => (
          <Image source={require('./email-icon.png')} style={styles.image} />
        )}
        right={props => <List.Icon {...props} icon={faStarShooting} />}
        title="List Item 1"
        description={({ellipsizeMode, color: descriptionColor, fontSize}) => (
          <View style={[styles.container, styles.column]}>
            <Text
              numberOfLines={2}
              ellipsizeMode={ellipsizeMode}
              style={{color: descriptionColor, fontSize}}
            >
              React Native Paper is a high-quality, standard-compliant Material
              Design library that has you covered in all major use-cases.
            </Text>
            <View style={[styles.container, styles.row, {paddingTop: 8}]}>
              <Chip icon={faEquals} onPress={() => {}}>
                DOCS.pdf
              </Chip>
            </View>
          </View>
        )}
      />
    </List.Section>
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
