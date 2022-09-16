import React from 'react';

import { View } from 'react-native';

import {Badge} from '@jmsstudiosinc/react-native-paper';
import { Metadata } from '.';

const ListMetaBadged = ({
    title, 
    quantity,
    titleVariant,
    style,
    titleStyle
}) => (
    <View style={[{justifyContent: "center", marginLeft: 16}, style]}>
        {title && <Metadata title={title} variant={titleVariant} style={titleStyle} />}
        {quantity && <Badge>{quantity}</Badge>}
    </View>
)

export default ListMetaBadged;
