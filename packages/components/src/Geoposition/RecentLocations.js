import React from 'react';

import { Divider, List } from '@jmstechnologiesinc/react-native-paper';
import { plurulize } from '@jmstechnologiesinc/commons';
import { LocationListItem, interpunctLocationListItemDescription } from '../LocationListItem/LocationListItem';
import {
    localized,
    itemSeparator
} from '@jmstechnologiesinc/react-native-components';

export const LOCATION_LIST_ITEM = {
    fulfillmentAddress: 'fulfillmentAddress',
    pickupAddress: 'pickupAddress',
    currentLocation: 'currentLocation',
};

const RecentLocations = ({
    title = localized('recentLocation'),
    locations,
    limit,
    variant = LOCATION_LIST_ITEM.currentLocation,
    onPress
}) => {
    if (!locations?.length) {
        return null;
    }

    const recentLocations = (limit > 0) ? locations.slice(0, 2) : locations;

    return (
        <List.Section title={localized(plurulize(title, recentLocations.length))}>
            {recentLocations.map((location, index) => (
                <>
                    <LocationListItem
                        key={location?.id}
                        title={location?.formattedAddress}
                        variant={variant}
                       // iconColor={null}
                        description={
                            location?.description || interpunctLocationListItemDescription(location)
                        }
                        onPress={() => onPress?.(location)} />
                    {itemSeparator(index, recentLocations.length) ? <Divider horizontalInset /> : null}
                </>
            ))}
        </List.Section>
    )
};

export default RecentLocations;
