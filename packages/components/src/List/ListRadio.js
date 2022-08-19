import React from 'react';

import { List, RadioButton } from '@jmsstudiosinc/react-native-paper';
import { Metadata } from '.';

const ListRadio = ({ title, description, metadata, isDisabled, isChecked, onPress, ...props }) => (
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
        right={() => <Metadata title={metadata} />}
    />
);

export default ListRadio;
