import React, { useRef, useState } from "react";
import { BottomSheetFooter, BottomSheetFlatList } from "@jmstechnologiesinc/bottom-sheet";
import { FAB, List, MD3LightTheme } from "@jmstechnologiesinc/react-native-paper";
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'
import { localized } from "../Localization/Localization";
import ProductListItem from "./ProductListItem";
import styles from "../styles";
import { ACCOUNTING_ITEMS } from "@jmstechnologiesinc/commons";

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { Dimensions, View } from "react-native";
import RideAndSharingDetails from "./RideAndSharingDetails";

import MapboxGLWrapper from "@jmstechnologiesinc/react-native-components/lib/MapboxGLWrapper";
import GorhomBottomSheetWrapper from "@jmstechnologiesinc/react-native-components/lib/GorhomBottomSheetWrapper";
const nearbyPoints = [
    {
        id: 123,
        title: 'Terra Luna',
        longitude: -71.15919996067139,
        latitude: 42.70798768081632,
        iconKey: 'restaurantIcon',
    },
    {
        id: 124,
        title: 'La Grekka Café Art & Lounge',
        longitude: -71.15860562951806,
        latitude: 42.707942772972984,
        iconKey: 'restaurantIcon',
    },
    {
        id: 15,
        title: "Dental Arts",
        longitude: -71.1593603130583,
        latitude: 42.707462193310384,
        iconKey: 'carIcon',
    },
    {
        id: 16,
        title: "McDonald's",
        longitude: -71.16874090687317,
        latitude: 42.70519895303485,
        iconKey: 'restaurantIcon',
    },

];

const { height } = Dimensions.get('window');

const RideAndSharingCheckout = ({
    originLocation,
    originLocationDescription,
    dropoffLocation,
    dropoffLocationDescription,
    cart,
    selectedItem,
    RenderPaymentMethod,
    onItemPress,
    onPress,
    originLocationOnPress,
    dropoffLocationOnPress,
}) => {
    const turnByTurnRouteRef = useRef();
    const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
    const [currentSnapPointGps, setCurrentSnapPointGps] = useState(0);


    const [footerHeight, setFooterHeight] = useState(0);

    const listHeaderComponent = () => (
        <>
            <RideAndSharingDetails
                originLocation={originLocation}
                dropoffLocation={dropoffLocation}
                originLocationDescription={originLocationDescription}
                dropoffLocationDescription={dropoffLocationDescription}
                originLocationOnPress={originLocationOnPress}
                dropoffLocationOnPress={dropoffLocationOnPress}
                RenderPaymentMethod={RenderPaymentMethod} />
            <ScreenWrapper.Section />
            <List.Subheader>{cart.title}</List.Subheader>
        </>
    );

    const footerComponent = (props) => (
        <BottomSheetFooter {...props} >
            <ScreenWrapper withScrollView={false} withPaddingHorizontal={false} withBottomInset={true}>
                {true ? (
                    <ScreenWrapper.Section>
                        <RenderPaymentMethod />
                    </ScreenWrapper.Section>
                ) : null}

                <FAB
                    disabled={!originLocation?.id || !dropoffLocation?.id}
                    label={localized('trip.requestRide')}
                    variant='secondary'
                    mode="elevated"
                    onPress={onPress}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setFooterHeight(height);
                    }}
                    style={[styles.button]} />
            </ScreenWrapper>
        </BottomSheetFooter>
    )



    const handleSheetChange = (percent) => {
        setCurrentSnapPoint(percent);
        turnByTurnRouteRef.current.setCameraSnapPoint(percent);
        const gpsMap = {
            0.5: 0.47,
            0.75: 0.56,
            1: 0.7,
        };

        if (gpsMap[percent] !== undefined) {
            setCurrentSnapPointGps(gpsMap[percent]);
        }
    };
    
    return (
        <MapboxGLWrapper>
            <MapboxGLWrapper.DriverRouteMonitoring
                ref={turnByTurnRouteRef}
                driverLocation={{
                    longitude: selectedItem?.driver?.longitude,
                    latitude: selectedItem?.driver?.latitude,
                    formattedValue: selectedItem?.eta?.formattedValue
                }}
                destinationLocation={dropoffLocation}
                locationOnPress={originLocationOnPress}>
                {nearbyPoints.map((marker) => (
                    <MapboxGLWrapper.SingleIconMarker
                        key={marker.id}
                        id={marker.id}
                        iconKey={'carIcon'}
                        longitude={marker.longitude}
                        latitude={marker.latitude}
                        rotation={0} />
                ))}

            </MapboxGLWrapper.DriverRouteMonitoring>
            <MapboxGLWrapper.ResetToInitialPositionIcon
                altitude={height * currentSnapPointGps}
                onPress={() => turnByTurnRouteRef.current.setCameraSnapPoint(currentSnapPoint)} />
            <GorhomBottomSheetWrapper
                snapPointIndex={2}
                listHeaderComponent={listHeaderComponent}
                footerComponent={footerComponent}
                onChange={handleSheetChange}>
                {cart?.products?.length ? (
                    <>
                        <BottomSheetFlatList
                            data={cart.products}
                            renderItem={({ item }) => (
                                <List.Accordion
                                    right={() => null}
                                    expanded
                                    title={item.title}
                                    description={item.token}>
                                    {item.data.map(offer => (
                                        <ProductListItem
                                            isChecked={offer.token === selectedItem?.token}
                                            title={offer.eta.formattedValue}
                                            price={offer.costs[ACCOUNTING_ITEMS.total].formattedValue}
                                            chips={item.chips}
                                            onPress={() => onItemPress(offer)}
                                        />
                                    ))}
                                </List.Accordion>
                            )}
                            ListHeaderComponent={listHeaderComponent}
                            stickySectionHeadersEnabled={false}
                            showsVerticalScrollIndicator={false} />
                        <View style={{ height: moderateScale(footerHeight) + MD3LightTheme.spacing.x7 }} />
                    </>
                ) : null}
            </GorhomBottomSheetWrapper>
        </MapboxGLWrapper>
    );
};

export default RideAndSharingCheckout;
