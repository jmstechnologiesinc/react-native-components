import React from 'react';

import { View } from 'react-native';

import { Badge, Text, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const ListMetaBadged = ({ title, quantity, style, titleStyle, titleVariant = 'bodyMedium', quantityStyle }) => (
    <View
        style={[
            {
                justifyContent: 'center',
                paddingLeft: MD3LightTheme.spacing.x4,
                paddingRight: MD3LightTheme.spacing.x2,
            },
            style,
        ]}
    >
        {title && (
            <Text
                variant={titleVariant}
                style={[
                    {
                        color: MD3LightTheme.colors.onSurfaceVariant,
                        marginBottom: 2,
                    },
                    titleStyle,
                ]}
            >
                {title}
            </Text>
        )}
        {quantity && (
            <Badge style={[{ backgroundColor: MD3LightTheme.colors.onSurfaceVariant }, quantityStyle]}>
                {quantity}
            </Badge>
        )}
    </View>
);

export default ListMetaBadged;
