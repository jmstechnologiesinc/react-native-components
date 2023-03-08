import React from 'react';

import { View } from 'react-native';

import { List, RadioButton, Checkbox } from '@jmsstudiosinc/react-native-paper';
import { MetaBadged } from '../List/List';

const CheckRadio = ({
    title,
    description,
    metaTitle,
    titleNumberOfLines = 0,
    descriptionNumberOfLines = 0,
    isDisabled,
    isChecked,
    onPress,
    variant = 'radio',
    ...props
}) => (
    <List.Item
        title={title}
        description={description}
        disabled={isDisabled}
        titleNumberOfLines={titleNumberOfLines}
        descriptionNumberOfLines={descriptionNumberOfLines}
        onPress={() => onPress?.(!isChecked)}
        left={(props) =>
            variant === 'radio' ? (
                <View style={props.style}>
                    <RadioButton.Android
                        status={isChecked ? 'checked' : 'unchecked'}
                        disabled={isDisabled}
                        onPress={() => onPress?.(!isChecked)}
                    />
                </View>
            ) : (
                <View style={props.style}>
                    <Checkbox.Android
                        status={isChecked ? 'checked' : 'unchecked'}
                        disabled={isDisabled}
                        onPress={() => onPress?.(!isChecked)}
                    />
                </View>
            )
        }
        right={() => <MetaBadged title={metaTitle} />}
        {...props}
    />
);

export default CheckRadio;
