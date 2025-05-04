import React from 'react';

import { Divider, List } from '@jmstechnologiesinc/react-native-paper';
import { plurulize } from '@jmstechnologiesinc/commons';
import { LOCATION_LIST_ITEM, LocationListItem } from '../LocationListItem/LocationListItem';
import {
    localized,
    itemSeparator
} from '@jmstechnologiesinc/react-native-components';

const RecentLocations = ({
    title = localized('savedAddresses'),
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
                        description={location.vicinity}
                        variant={variant}
                        iconColor={null}
                        onPress={() => onPress?.(location)} />
                    {itemSeparator(index, recentLocations.length) ? <Divider horizontalInset /> : null}
                </>
            ))}
        </List.Section>
    )
};

export default RecentLocations;
