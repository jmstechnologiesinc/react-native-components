import React from 'react';

import List from '../../ListItem/src/ListItem';
import Divider from '../../ReactNativePaper/components/Divider';

const Header = ({
    title,
    divider
}) => divider ? <Divider leftInset title={title} /> : <List.Subheader>{title}</List.Subheader>

export default Header;
