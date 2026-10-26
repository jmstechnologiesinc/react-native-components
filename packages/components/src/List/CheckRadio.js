import React from 'react';

import { View } from 'react-native';

import { RadioButton, Checkbox } from '@jmstechnologiesinc/react-native-paper';
import * as JMSList from './List';

const CheckRadio = ({
    title,
    description,
    metaTitle,
    chips,
    titleNumberOfLines = 0,
    descriptionNumberOfLines = 0,
    isDisabled,
    isChecked,
    onPress,
    variant = 'radio',
    leftStyle,
    ...props
}) => (
    <JMSList.Item
        title={title}
        description={description}
        chips={chips}
        disabled={isDisabled}
        titleNumberOfLines={titleNumberOfLines}
        descriptionNumberOfLines={descriptionNumberOfLines}
        onPress={() => onPress?.(!isChecked)}
        left={(props) =>
            variant === 'radio' ? (
                <View style={[props.style, leftStyle]}>
                    <RadioButton.Android
                        status={isChecked ? 'checked' : 'unchecked'}
                        disabled={isDisabled}
                        onPress={() => onPress?.(!isChecked)}
                    />
                </View>
            ) : (
                <View style={[props.style, leftStyle]}>
                    <Checkbox.Android
                        status={isChecked ? 'checked' : 'unchecked'}
                        disabled={isDisabled}
                        onPress={() => onPress?.(!isChecked)}
                    />
                </View>
            )
        }
        right={() => <JMSList.MetaBadged title={metaTitle} />}
        {...props}
    />
);

export default CheckRadio;
