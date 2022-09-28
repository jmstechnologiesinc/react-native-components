import React from 'react';

import {Text, MD3LightTheme} from '@jmsstudiosinc/react-native-paper';

const ListMetadata = ({
    title, 
    variant="bodyMedium", 
    style
}) => (
    <Text 
        variant={variant}
        style={[{
            display: "flex", 
            alignItems: "center", 
            lineHeight: 24,
            color: MD3LightTheme.colors.primary
        }, style]}>
        {title}
    </Text>
)

export default ListMetadata;
