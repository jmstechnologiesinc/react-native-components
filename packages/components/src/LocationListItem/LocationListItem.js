import React from 'react';

import { List } from '@jmstechnologiesinc/react-native-paper';
import { interpunct } from '@jmstechnologiesinc/commons';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

export const LOCATION_LIST_ITEM = {
    fulfillmentAddress: 'fulfillmentAddress',
    pickupAddress: 'pickupAddress',
    currentLocation: 'currentLocation',
    locationHistory: 'locationHistory',
    destinationSuggestion: 'destinationSuggestion',
    hailLocation: 'hailLocation',
};

export const LOCATION_LIST_ITEM_MAPPING = {
    [LOCATION_LIST_ITEM.fulfillmentAddress]: 'home-map-marker',
    [LOCATION_LIST_ITEM.pickupAddress]: 'store-marker',
    [LOCATION_LIST_ITEM.currentLocation]: 'crosshairs-gps',
    [LOCATION_LIST_ITEM.locationHistory]: 'map-clock-outline',
    [LOCATION_LIST_ITEM.destinationSuggestion]: 'map-marker-star-outline',
    [LOCATION_LIST_ITEM.hailLocation]: 'hail',
};

export const interpunctLocationListItemDescription = ({ floorNumber, buildingName, note }) =>
    interpunct([floorNumber, buildingName, note]);

export const LocationListItem = ({
    title,
    description,
    variant,
    iconColor,
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


