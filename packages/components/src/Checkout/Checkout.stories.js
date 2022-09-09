import React from 'react';

import { Divider, List} from '@jmsstudiosinc/react-native-paper';
import Accounting from './Accounting';

import mockData from "./mockData.json"

export default {
  title: 'packages/Breakdown',
};

export const Fees = () => <Accounting fees={mockData} />
export const Shipping = () =>  (
  <List.Section title="Title">
    <Divider />
    <List.Item 
      title="155 Boxford St, Lawrence MA 01843" 
      description="Shipping" 
      left={() => <List.Icon icon="folder" />} 
      right={() => <List.Icon icon="folder" />} 
      onPress={() => {}} />
    <Divider />
    <List.Item 
      title="****1234" 
      description="Visa" 
      left={() => <List.Icon icon="folder" />}
      right={() => <List.Icon icon="folder" />} 
      onPress={() => {}} />
    <Divider />
   </List.Section>
)