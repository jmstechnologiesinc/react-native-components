import React from 'react';

import { View } from 'react-native';

import { List, RadioButton, Checkbox } from '@jmsstudiosinc/react-native-paper';
import { MetaBadged } from '../List/List';

const CheckRadio = ({ title, description, metadata, isDisabled, isChecked, onPress, variant = 'radio', ...props }) => (
    <List.Item
        title={title}
        description={description}
        onPress={() => onPress?.(!isChecked)}
        disabled={isDisabled}
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
        right={() => <MetaBadged title={metadata} />}
        {...props}
    />
);

export default CheckRadio;
