import React from 'react';

import { View } from 'react-native';

import {Badge, MD3LightTheme} from '@jmsstudiosinc/react-native-paper';
import { Metadata } from '.';

const ListMetaBadged = ({
    title, 
    quantity,
    titleVariant,
    style,
    titleStyle,
    quantityStyle
}) => (
    <View style={[{justifyContent: "center", marginLeft: 16}, style]}>
        {title && <Metadata title={title} variant={titleVariant} style={titleStyle} />}
        {quantity && <Badge style={[{backgroundColor: MD3LightTheme.colors.primary}, quantityStyle]}>{quantity}</Badge>}
    </View>
)

export default ListMetaBadged;
