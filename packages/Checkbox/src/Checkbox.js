import React from 'react';

import Datas from './mockData.json';
import renderField from './RenderItem';
import {SectionList} from 'react-native';
const Checkbox = () => {
  return (
    <SectionList
      sections={Datas}
      keyExtractor={item => item.uuid}
      renderItem={({item, section}) => renderField(item, section)}
    />
  );
};

export default Checkbox;
