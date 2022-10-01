import React from 'react';

import {List, Checkbox} from '@jmsstudiosinc/react-native-paper';
import {Metadata} from './List';

const ListCheckbox = ({
    title,
    description,
    metadata,
    isDisabled,
    isChecked,
    onPress,
    ...props
}) => <List.Item 
  {...props}
  title={title}
  description={description}
  onPress={() => onPress(!isChecked)}
  left={() => <Checkbox
    status={isChecked ? 'checked' : 'unchecked'}
    disabled={isDisabled}
    onPress={() => onPress(!isChecked)} />}
  right={() => <Metadata title={metadata} />}/>


export default ListCheckbox;
