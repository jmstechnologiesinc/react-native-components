import React from 'react';

import { List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import { interpunct } from '@jmstechnologiesinc/commons';
import { MATERIAL_ICONS } from '@jmstechnologiesinc/commons';

export const LOCATION_LIST_ITEM = {
    shippingAddress: 'shippingAddress',
    pickupAddress: 'pickupAddress',
    currentLocation: 'currentLocation',
};

const LOCATION_LIST_ITEM_MAPPING = {
    [LOCATION_LIST_ITEM.shippingAddress]: 'home-map-marker',
    [LOCATION_LIST_ITEM.pickupAddress]: 'store-marker',
    [LOCATION_LIST_ITEM.currentLocation]: MATERIAL_ICONS.location,
};

export const interpunctLocationListItemDescription = ({ floorNumber, buildingName, note }) =>
    interpunct([floorNumber, buildingName, note]);

const LocationListItem = ({ title, description, variant, onPress }) => (
    <List.Item
        title={title}
        description={description}
        left={
            variant
                ? (props) => (
                      <List.Icon
                          {...props}
                          icon={LOCATION_LIST_ITEM_MAPPING[variant]}
                          color={
                              LOCATION_LIST_ITEM_MAPPING[variant] === LOCATION_LIST_ITEM_MAPPING.currentLocation
                                  ? MD3LightTheme.colors.primary
                                  : null
                          }
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

export default LocationListItem;
