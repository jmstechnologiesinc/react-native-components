import React from 'react';
import { View } from 'react-native';

import * as List from '.';

export default {
  title: 'packages/List',
};

import * as JMSList from "./";

export const MetadataTitle = () => <List.Metadata title="$2.99" />
export const MetaBadged = () => <View style={{flexDirection: "row"}}>
  <List.MetaBadged title="$2.99" quantity={9} />
</View>
export const OneLineImage = () =>  <JMSList.Image 
  src={require('./wrecked-ship.jpg')}
  title="NinjaFongo Churrasco (skirt steak)"
  right={() => <JMSList.Metadata title={34.45} />} />

export const TwoLinesImage = () =>  <JMSList.Image 
  src={require('./wrecked-ship.jpg')}
  title="NinjaFongo Churrasco (skirt steak)"
  description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."/>

  