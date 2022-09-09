import React from 'react';

import {Text, MD3LightTheme} from '@jmsstudiosinc/react-native-paper';

const ListMetadata = ({title, style}) => (
    <Text 
        variant="bodyMedium" 
        style={{
            display: "flex", 
            alignItems: "center", 
            lineHeight: 24,
            color: MD3LightTheme.colors.onSurface,
            ...style
        }}>
        {title}
    </Text>
)

export default ListMetadata;
