import React from 'react';

import { StyleSheet } from 'react-native';

import { Avatar, Chip, MD3LightTheme } from '@/react-native-paper';
import { fastImageUrl, ITEM_TYPE, ITEM_TYPE_ICON_MAPPING } from '@/commons';

import JMSItem from '../List/ListItem';
import { makeLinkingCall } from '../utils';

export const renderChipType = (chip) => {
    switch (chip.type) {
        case ITEM_TYPE.call:
            return (
                <Chip
                    mode="outlined"
                    icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
                    style={styles.chip}
                    onPress={() => makeLinkingCall(chip.value)}
                >
                    {chip.formattedValue}
                </Chip>
            );
            break;
        default:
            return (
                <Chip
                    mode={chip.type === ITEM_TYPE.needAttention ? 'flat' : 'outlined'}
                    icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
                    style={styles.chip}
                >
                    {chip.formattedValue}
                </Chip>
            );
            break;
    }
};

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

    titleVariant,
    style,
    titleStyle,
    overlineStyle,
}) => {
    const renderAvatar =
        showAvatar && avatar
            ? (props) => <Avatar.Image style={props.style} source={{ uri: fastImageUrl(avatar) }} />
            : null;

    const renderChips = showChips && chips?.length > 0 ? chips.map(renderChipType) : null;

    const description = [];

    if (showOverline && overline) {
        description.push(overline);
    }

    if (showDescription && subHeader) {
        if (Array.isArray(subHeader)) {
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
            titleNumberOfLines={0}
            descriptionNumberOfLines={0}
            style={style}
            titleVariant={titleVariant}
            titleStyle={titleStyle}
            overlineStyle={overlineStyle}
        />
    );
};

const styles = StyleSheet.create({
    chip: {
        marginRight: MD3LightTheme.spacing.x2,
    },
});

export default OrderStatusWrapper;
