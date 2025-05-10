import React, { useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFooter, BottomSheetFlatList } from "@jmstechnologiesinc/bottom-sheet";
import { FAB, List, MD3LightTheme } from "@jmstechnologiesinc/react-native-paper";
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'
import { localized } from "../Localization/Localization";
import ProductListItem from "./ProductListItem";
import styles from "../styles";
import { ACCOUNTING_ITEMS } from "@jmstechnologiesinc/commons";

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RideAndSharingDetails from "./RideAndSharingDetails";

import GeoPositionTracker from "../GeoPositionTracker";

const RideAndSharingCheckout = ({
    originLocation,
    originLocationDescription,
    dropoffLocation,
    dropoffLocationDescription,
    cart,
    selectedItem,
    originLocationOnPress,
    dropoffLocationOnPress,
    RenderPaymentMethod,
    withBottomInset = true,
    withTopInset = false,
    onItemPress,
    onPress,
    getGPSLocationOnPress,
    isLocationPermission,
    BackButton
}) => {
   
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["50%", "75%", "100%"], []);
    const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
    const insets = useSafeAreaInsets();
    const [footerHeight, setFooterHeight] = useState(0);


    const isInsetsBottom = insets.bottom === 0 ? MD3LightTheme.spacing.x4 : insets.bottom;

    const containerStyle = [
        {
            paddingTop: withTopInset ? insets.top : 0,
            paddingBottom: withBottomInset ? isInsetsBottom : 0,
            paddingLeft: insets.left,
            paddingRight: insets.left,
            marginTop: insets.top,

        },
    ]


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

    const renderFooter = (props) => (
        <BottomSheetFooter {...props} >
            <ScreenWrapper withScrollView={false} withPaddingHorizontal={false} withBottomInset={true}

            >
                            <ScreenWrapper.Section >

             {true ? (
                <RenderPaymentMethod />
            ) : null} 
</ScreenWrapper.Section>
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
                    style={[styles.button]}
                />
            </ScreenWrapper>
        </BottomSheetFooter>
    )

    // const handleSheetChange = useCallback((index) => {
    //     setCurrentSnapPoint(parseFloat(snapPoints[index]) / 100);
    // }, []);
    
    const handleSheetChange = useCallback((index) => {
        if (typeof index !== 'number' || !snapPoints[index]) return;
    
        const raw = snapPoints[index].replace('%', '');    
        const percent = parseFloat(raw);                   
        if (isNaN(percent)) return;                        
        setCurrentSnapPoint(percent / 100);
      }, [snapPoints]);


    return (
        <>
            <GeoPositionTracker
                customerPosition={originLocation}
                currentDriverPosition={{
                    longitude: selectedItem?.driver?.longitude,
                    latitude: selectedItem?.driver?.latitude,
                }}
                vendorPosition={dropoffLocation}
                currentSnapPoint={currentSnapPoint}
                nearbyVehicleLocations={cart?.vehiclePoints}
                getGPSLocationOnPress={getGPSLocationOnPress}
                isLocationPermission={isLocationPermission}
                originLocation={originLocation}
                dropoffLocation={dropoffLocation}
                selectedItem={selectedItem}
                locationOnPress={originLocationOnPress}
            />

            <BackButton />

            <BottomSheet
                ref={bottomSheetRef}
                index={2}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                footerComponent={renderFooter}
                containerStyle={containerStyle}
                backgroundStyle={{
                    flex: 1,
                    backgroundColor: MD3LightTheme.colors.background,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: moderateScale(2),
                    },
                    shadowOpacity: moderateScale(0.25),
                    shadowRadius: moderateScale(3.84),
                    elevation: moderateScale(10),
                }}
                handleStyle={{
                    backgroundColor: MD3LightTheme.colors.background,
                }}

                onChange={handleSheetChange}
            >
                {cart?.products?.length ? (
                    <>
                        <BottomSheetFlatList
                            data={cart.products}
                            //keyExtractor={keyExtractor}
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
                            //ListFooterComponent={listFooterComponent}
                            stickySectionHeadersEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                        <View style={{ height: moderateScale(footerHeight) + MD3LightTheme.spacing.x7 }} />
                    </>
                ) : null}
            </BottomSheet>
        </>
    );
};

export default RideAndSharingCheckout;
