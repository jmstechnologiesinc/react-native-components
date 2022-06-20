// stories/MyButton.stories.tsx
import React from 'react';
import { TouchableHighlight } from "react-native";
import { Text } from 'react-native';
import { ListItem } from '.';
import { Avatar } from '../Avatar/Avatar';


export default {
  title: 'components/ListItem',
  component: ListItem,
};

export const Basic = args => (
  <ListItem
  Component={TouchableHighlight}
  containerStyle={{}}
  disabledStyle={{ opacity: 0.5 }}
  onLongPress={() => console.log("onLongPress()")}
  onPress={() => console.log("onLongPress()")}
  pad={20}
>
  <Avatar  source={{uri: "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4"}} /> 

  <ListItem.Content>
    <ListItem.Title>
      <Text>Pranshu Chittora</Text>
    </ListItem.Title>
    <ListItem.Subtitle>
      <Text>React Native Elements</Text>
    </ListItem.Subtitle>
  </ListItem.Content>
</ListItem>
);


Basic.args = {
  text: 'Hello World',
  color: 'purple',
};