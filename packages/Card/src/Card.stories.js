import React from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
// import {
//   Avatar,
//   Paragraph,
//   Card,
//   Button,
//   IconButton,
//   useTheme,
// } from 'react-native-paper';

import Card from './Card';
// IconButton

import Paragraph from '../../ReactNativePaper/components/Typography/v2/Paragraph';
import Button from '../../ReactNativePaper/components/Button/Button';
// import { IconButton } from '../../ReactNativePaper/components/IconButton';

export default {
  title: 'packages/Card',
  component: Card,
};

export const Cards = () => {
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: '#fff'}]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Cover source={require('../../../images/forest.jpg')} />
        <Card.Title title="Abandoned Ship" />
        <Card.Content>
          <Paragraph>
            The Abandoned Ship is a wrecked ship located on Route 108 in Hoenn,
            originally being a ship named the S.S. Cactus. The second part of
            the ship can only be accessed by using Dive and contains the
            Scanner.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Cover source={require('../../../images/forest.jpg')} />
        <Card.Actions>
          <Button onPress={() => {}}>Share</Button>
          <Button onPress={() => {}}>Explore</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
});
