import * as React from 'react';
import {FlatList} from 'react-native';
import {Divider, List} from '@jmsstudiosinc/react-native-paper';

const items = ['Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach'];

export default {
  title: 'Component/Divider',
  component: Divider,
};

export const DividerExample = () => {
  return (
    <FlatList
      style={{backgroundColor: '#fff'}}
      renderItem={({item}) => <List.Item title={item} />}
      keyExtractor={item => item}
      ItemSeparatorComponent={Divider}
      data={items}
    />
  );
};

DividerExample.title = 'Divider';
