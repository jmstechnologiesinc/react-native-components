import React, { useState } from "react";
import {  Divider, List, MD3LightTheme, } from "@jmstechnologiesinc/react-native-paper";
import LocationListItem, { LOCATION_LIST_ITEM } from "../LocationListItem/LocationListItem";
import { localized } from "../Localization/Localization";
import { interpunct } from "@jmstechnologiesinc/commons";

const RideAndSharingDetails = ({
    originLocation,
    originLocationDescription,
    dropoffLocation,
    dropoffLocationDescription,
    originLocationOnPress,
    dropoffLocationOnPress,
    RenderPaymentMethod,
}) => {
    const [iscoordinateOpen, setisCoordinateOpen] = useState(false)
    console.log(JSON.stringify(dropoffLocation,null,2))
    return  <>
        <List.Accordion
            expanded={iscoordinateOpen}
            onPress={() => setisCoordinateOpen(!iscoordinateOpen)}
            description={!iscoordinateOpen ? "Leave Now" : null}
            title={!iscoordinateOpen ? interpunct([
                originLocation.line1, 
                dropoffLocation.line1
            ]) : "Leave Now"}>
            <LocationListItem
                title={originLocation?.formattedAddress}
                description={originLocationDescription}
                variant={LOCATION_LIST_ITEM.currentLocation}
                onPress={originLocationOnPress}
            />
            <LocationListItem
                title={dropoffLocation?.formattedAddress}
                description={dropoffLocationDescription}
                variant={LOCATION_LIST_ITEM.currentLocation}
                onPress={dropoffLocationOnPress}
            />
        </List.Accordion>
        <List.Section >
            {RenderPaymentMethod ? (
                <RenderPaymentMethod  />
            ) : null}
        </List.Section>
        <Divider style={{ marginBottom: MD3LightTheme.spacing.x1 }}  />
    </>
};

export default RideAndSharingDetails;
