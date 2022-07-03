import React from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';

import {
  Card,
  Button,
  Paragraph,
  IconButton,
  Avatar,
} from '@jmsstudiosinc/react-native-paper';

export default {
  title: 'Component/Card',
  component: Card,
};
import {faChevronCircleDown} from '@fortawesome/pro-regular-svg-icons';
export const Cards = () => {
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: '#fff'}]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Cover source={require('../../images/forest.jpg')} />
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
        <Card.Cover source={require('../../images/forest.jpg')} />
        <Card.Actions>
          <Button onPress={() => {}}>Share</Button>
          <Button onPress={() => {}}>Explore</Button>
        </Card.Actions>
      </Card>
      <Card style={styles.card}>
        <Card.Cover source={require('../../images/strawberries.jpg')} />
        <Card.Title
          title="Just Strawberries"
          subtitle="... and only Strawberries"
          right={props => (
            <IconButton
              {...props}
              icon={faChevronCircleDown}
              onPress={() => {}}
            />
          )}
        />
      </Card>
      <Card
        style={styles.card}
        onPress={() => {
          Alert.alert('The Chameleon is Pressed');
        }}
      >
        <Card.Cover source={require('../../images/chameleon.jpg')} />
        <Card.Title title="Pressable Chameleon" />
        <Card.Content>
          <Paragraph>
            This is a pressable chameleon. If you press me, I will alert.
          </Paragraph>
        </Card.Content>
      </Card>
      <Card
        style={styles.card}
        onLongPress={() => {
          Alert.alert('The City is Long Pressed');
        }}
      >
        <Card.Cover source={require('../../images/city.jpg')} />
        <Card.Title
          title="Long Pressable City"
          left={props => <Avatar.Icon {...props} icon={faChevronCircleDown} />}
        />
        <Card.Content>
          <Paragraph>
            This is a long press only city. If you long press me, I will alert.
          </Paragraph>
        </Card.Content>
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
