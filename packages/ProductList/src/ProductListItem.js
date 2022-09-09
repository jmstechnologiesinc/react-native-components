import React from 'react';

import {List} from '@jmsstudiosinc/react-native-paper';
import * as JMSList from "../../List/src";

const ProductListItem = ({
    uuid,
    title,
    photo,
    description,
    price,
    cartQuantity,
    onPress,
}) => (
  <List.Section>
    <JMSList.Item 
      title={title}
      photo={photo}
      description={description}
      metaTitle={price}
      metaQuantity={cartQuantity}
      onPress={onPress} />
  </List.Section> 
)

export default ProductListItem;
