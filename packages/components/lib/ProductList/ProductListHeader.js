import React from 'react';

import {List, Divider} from '@jmsstudiosinc/react-native-paper';

const ProductListHeader = ({
    title,
    divider
}) => divider ? <Divider leftInset title={title} /> : <List.Subheader>{title}</List.Subheader>

export default ProductListHeader;
