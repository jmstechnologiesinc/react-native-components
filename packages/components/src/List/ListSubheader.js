import React from 'react';

import { View } from 'react-native';

import {List, Avatar, Text} from '@jmsstudiosinc/react-native-paper';

const ListSubheader = ({
    title, 
    overline, 
    description, 
    avatar
}) => {
    const renderTitle = () => (
        <View>
             {overline && <Text style={{paddingHorizontal: 16}} variant="labelSmall">{overline}</Text>}
             {title && <List.Subheader style={{...(overline && {paddingTop:  0})}} >{title}</List.Subheader>}
        </View>
    )

    return <List.Item
        style={{padding: 0}}
        itemStyle={{marginVertical: 0, paddingLeft: 0}}
        title={renderTitle}
        description={description ? () => <Text  style={{paddingHorizontal: 16}} variant="labelSmall">{description}</Text> : null}
        left={avatar ? () => <Avatar.Image size={40} style={{margin: 8, marginRight: 0}} source={avatar}/> : null} />
}

export default ListSubheader;
