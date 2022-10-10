import React from 'react';

import { List, RadioButton } from '@jmsstudiosinc/react-native-paper';
import { MetaBadged } from './List';

const ListRadio = ({ 
    title, 
    description, 
    metadata, 
    isDisabled, 
    isChecked, 
    onPress, 
    ...props 
}) => (
    <List.Item
        {...props}
        title={title}
        description={description}
        onPress={() => onPress(!isChecked)}
        left={() => (
            <RadioButton.Android
                status={isChecked ? 'checked' : 'unchecked'}
                disabled={isDisabled}
                onPress={() => onPress(!isChecked)}
            />
        )}
        right={() => <MetaBadged title={metadata} />}
    />
);

export default ListRadio;
