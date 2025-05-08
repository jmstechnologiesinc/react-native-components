import React, { useState } from "react";
import { Divider, List, MD3LightTheme, } from "@jmstechnologiesinc/react-native-paper";
import { LOCATION_LIST_ITEM, LocationListItem } from "../LocationListItem/LocationListItem";
import { localized } from "../Localization/Localization";
import { interpunct } from "@jmstechnologiesinc/commons";

const RideAndSharingDetails = ({
    originLocation,
    originLocationDescription,
    dropoffLocation,
    dropoffLocationDescription,
    originLocationOnPress,
    dropoffLocationOnPress,
}) => {
    const [iscoordinateOpen, setisCoordinateOpen] = useState(false)
console.log(JSON.stringify(originLocation,null,3))
console.log(JSON.stringify(dropoffLocation,null,3))

    return (
        <>
            <List.Accordion
                expanded={iscoordinateOpen}
                onPress={() => setisCoordinateOpen(!iscoordinateOpen)}
                title={localized("plannedRoute")}
                titleNumberOfLines={2}
                description={!iscoordinateOpen ? interpunct([
                    originLocation?.formattedAddress,
                    dropoffLocation?.formattedAddress
                ]) : null}>
                {originLocation?.id ? (
                    <List.Section title={localized('trip.originLocation')}>
                        <LocationListItem
                            title={originLocation.formattedAddress}
                            description={originLocation.vicinity}
                            variant={LOCATION_LIST_ITEM.hailLocation}
                            iconColor={MD3LightTheme.colors.primary}
                            onPress={originLocationOnPress}
                            />
                    </List.Section>
                ) : null}

                {dropoffLocation?.id ? (
                    <>
                        <List.Section title={localized('trip.dropoffLocation')}>
                            <LocationListItem
                                title={dropoffLocation.formattedAddress}
                                description={dropoffLocation.vicinity}
                                variant={LOCATION_LIST_ITEM.fulfillmentAddress}
                                iconColor={MD3LightTheme.colors.primary}
                                onPress={dropoffLocationOnPress}/>
                        </List.Section>
                        <Divider />
                    </>
                ) : null}
            </List.Accordion>
            <Divider />
        </>
    )
};

export default RideAndSharingDetails;
