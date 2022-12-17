import React from 'react';

import { View } from 'react-native';

import { Badge, Text, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const ListMetaBadged = ({
    title, 
    quantity,
    style,
    titleStyle,
    titleVariant="bodyMedium",
    quantityStyle,
}) => (
    <View style={[{alignSelf: "center", marginLeft: MD3LightTheme.spacing.x4}, style]}>
        {title && (
            <Text
                variant={titleVariant}
                style={titleStyle}>
                {title}
            </Text>
        )}
        {quantity && (
            <Badge style={[
                {backgroundColor: MD3LightTheme.colors.primary},
                quantityStyle
            ]}>{quantity}</Badge>
        )}
    </View>
);

export default ListMetaBadged;
