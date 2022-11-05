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
    justifyContent = "center"
}) => (
    <View style={[{
            justifyContent: justifyContent, 
            paddingLeft: MD3LightTheme.spacing.x4, 
            paddingRight: MD3LightTheme.spacing.x2
        }, style]}>
        {title && (
            <Text
                variant={titleVariant}
                style={[{
                    ...(quantity && {marginTop: -MD3LightTheme.spacing.x1})
                }, titleStyle]}>
                {title}
            </Text>
        )}
        {quantity && <Badge style={[{backgroundColor: MD3LightTheme.colors.primary}, quantityStyle]}>{quantity}</Badge>}
    </View>
);

export default ListMetaBadged;
