import React from "react";

import { StyleSheet } from "react-native";

import { Avatar, Chip, MD3LightTheme } from "@jmsstudiosinc/react-native-paper";

import JMSItem from '../List/ListItem';

const OrderStatusWrapper = ({
    overline,
    header,
    subHeader,
    chips,
    avatar,

    showOverline = true,
    showTitle = true,
    showDescription = true,
    showAvatar = true,
    showChips = true,
    style,
    titleStyle,
    overlineStyle,
}) => {
    const renderAvatar = (showAvatar && avatar) ? (props) => (
        <Avatar.Image style={props.style} source={{ uri: avatar }} />
    ) : null;

    const renderChips = (showChips && chips?.length > 0) ? chips.map((chip) => (
        <Chip mode="outlined" style={styles.chip}>
            {chip}
        </Chip>
    )) : null;

    const description = [];

    if(showOverline && overline) {
        description.push(overline);
    }

    if(showDescription && subHeader) {
        if(Array.isArray(subHeader)) {
            description.push(...subHeader);
        } else {
            description.push(subHeader);
        }
    }

    return ( 
        <JMSItem
            title={showTitle ? header : null}
            description={description}
            chips={renderChips}
            left={renderAvatar}    
            style={style}    
            titleStyle={titleStyle}
            overlineStyle={overlineStyle} />
    );
}

const styles = StyleSheet.create({
    chip: {
        marginTop: MD3LightTheme.spacing.x1,
        marginRight: MD3LightTheme.spacing.x2,
    }
});

export default OrderStatusWrapper