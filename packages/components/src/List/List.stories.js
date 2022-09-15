import React from 'react';

import * as List from '.';

export default {
  title: 'packages/List',
};

import * as JMSList from "./";

export const Metadata = () => <List.Metadata title="$2.99" />

export const OneLineListImage = () =>  <JMSList.Image 
  src={require('./wrecked-ship.jpg')}
  title="NinjaFongo Churrasco (skirt steak)"
  right={() => <JMSList.Metadata title={34.45} />} />

export const TwoLineListImage = () =>  <JMSList.Image 
  src={require('./wrecked-ship.jpg')}
  title="NinjaFongo Churrasco (skirt steak)"
  description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."/>
