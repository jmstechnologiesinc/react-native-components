import React from 'react';

import {List,  Avatar} from '@jmsstudiosinc/react-native-paper';
import { Metadata } from '.';
import { Text } from '@jmsstudiosinc/react-native-paper';

const ListSubheader = ({title, description, avatar, metadata}) => <List.Item
    style={{padding: 0}}
    itemStyle={{marginVertical: 0, paddingLeft: 0}}
    title={title ? () => <List.Subheader >{title}</List.Subheader> : null}
    description={description ? () => <Text variant="labelSmall">{description}</Text> : null}
    left={avatar ? () => <Avatar.Image size={40} style={{margin: 8, marginRight: 0}} source={avatar}/> : null}
    right={false ? () => <Metadata title={metadata} /> : null} />

export default ListSubheader;
