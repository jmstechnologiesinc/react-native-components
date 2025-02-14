import React from 'react';

import { List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { interpunct } from '@jmstechnologiesinc/commons';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

export const LOCATION_LIST_ITEM = {
    fulfillmentAddress: 'fulfillmentAddress',
    pickupAddress: 'pickupAddress',
    currentLocation: 'currentLocation',
    hailLocation: 'hailLocation',
};

const LOCATION_LIST_ITEM_MAPPING = {
    [LOCATION_LIST_ITEM.fulfillmentAddress]: 'home-map-marker',
    [LOCATION_LIST_ITEM.pickupAddress]: 'store-marker',
    [LOCATION_LIST_ITEM.currentLocation]: MATERIAL_ICONS.location,
    [LOCATION_LIST_ITEM.hailLocation]: 'hail',
};

export const interpunctLocationListItemDescription = ({ floorNumber, buildingName, note }) =>
    interpunct([floorNumber, buildingName, note]);

export const LocationListItem = ({
    title,
    description,
    variant,
    iconColor = MD3LightTheme.colors.primary,
    onPress
}) => (
    <List.Item
        title={title}
        description={description}
        left={
            variant
                ? (props) => (
                    <List.Icon
                        {...props}
                        icon={LOCATION_LIST_ITEM_MAPPING[variant]}
                        color={iconColor}
                    />
                )
                : null
        }
        right={onPress ? (props) => <List.Icon {...props} icon={MATERIAL_ICONS.chevron} /> : null}
        titleNumberOfLines={0}
        descriptionNumberOfLines={0}
        onPress={onPress}
    />
);


