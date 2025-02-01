import React, { useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFooter, BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { Appbar, FAB, List, MD3LightTheme, Surface } from "@jmstechnologiesinc/react-native-paper";
import TipsFilter from "../TipsFilter/TipsFilter";
import { localized } from "../Localization/Localization";
import ProductListItem from "./ProductListItem";
import { keyExtractor } from "../CartList/CartList";
import styles from "../styles";
import CheckoutSummary from "../CheckoutSummary/CheckoutSummary";
import { ACCOUNTING_ITEMS } from "@jmstechnologiesinc/cart";

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RideAndSharingDetails from "./RideAndSharingDetails";

import GeoPositionTracker from "../GeoPositionTracker";
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters'

const RideAndSharingCheckout = ({
    originLocation,
    originLocationDescription,
    dropoffLocation,
    dropoffLocationDescription,
    products,
    selectedItemId,
    fees,
    tipsFilter,
    originLocationOnPress,
    dropoffLocationOnPress,
    onTipsPercentPress,
    RenderPaymentMethod,
    withBottomInset = true,
    withTopInset = false,
    onItemPress,
    onPress,
    goBack,
    selectedDriver,
    getGPSLocationOnPress
}) => {
    const point = Platform.OS === 'ios' ? 0.5 : 0.54

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["50%", "75%", "100%"], []);
    const [currentSnapPoint, setCurrentSnapPoint] = useState(point);
    const insets = useSafeAreaInsets();

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
        <RideAndSharingDetails
            originLocation={originLocation}
            originLocationDescription={originLocationDescription}
            dropoffLocation={dropoffLocation}
            dropoffLocationDescription={dropoffLocationDescription}
            originLocationOnPress={originLocationOnPress}
            dropoffLocationOnPress={dropoffLocationOnPress}
            RenderPaymentMethod={RenderPaymentMethod} />
    );

    const listFooterComponent = () => (
        <View style={{ paddingBottom: insets.bottom }}>
            <TipsFilter
                options={tipsFilter.options}
                description={tipsFilter.description}
                selectedTipsPercentIndex={tipsFilter.selectedTipsPercentIndex}
                onTipsPercentPress={onTipsPercentPress}
            />
            <CheckoutSummary
                netFeeList={fees}
                termsAndConditions={"checkoutTermAndCondition"}
            />
        </View>
    );

    const renderFooter = (props) => (
        <BottomSheetFooter {...props}>
            <ScreenWrapper withScrollView={false} withPaddingHorizontal={false} withBottomInset={true}>
                <FAB
                    label={localized('trip.requestRide')}
                    variant='secondary'
                    mode="elevated"
                    style={[styles.button]}
                    onPress={onPress} />
            </ScreenWrapper>
        </BottomSheetFooter>
    )

    const getValueFromIndex = (index) => {
        switch (index) {
            case 0:
                return point;
            case 1:
                return 0.8;
            default:
                return point;
        }
    };

    const handleSheetChange = useCallback((index) => {
        const value = getValueFromIndex(index);
        setCurrentSnapPoint(value);
    }, []);


    const getVehiclePositions = (products) => {
        return products?.reduce((acc, item) => {
            const positions = item.data.map((dataItem) => {
                const { position } = dataItem.driver;
                return {
                    longitud: position[0],
                    latitud: position[1]
                };
            });
            return acc.concat(positions);
        }, []);
    };

    const nearbyVehicleLocations = getVehiclePositions(products)

    return (
        <>
            <GeoPositionTracker
                customerPosition={originLocation}
                currentDriverPosition={{
                    longitude: selectedDriver?.[0],
                    latitude: selectedDriver?.[1],
                }}
                // currentDriverPosition={dropoffLocation}
                vendorPosition={dropoffLocation}
                currentSnapPoint={currentSnapPoint}
                nearbyVehicleLocations={nearbyVehicleLocations}
                getGPSLocationOnPress={getGPSLocationOnPress}
            />

            <View style={{ position: 'absolute', top: moderateScale(insets.top) }}>
                <Appbar.BackAction mode='contained' onPress={goBack} />
            </View >

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
                {products?.length ? (
                    <BottomSheetSectionList
                        sections={products}
                        keyExtractor={keyExtractor}
                        renderSectionHeader={({ section: { title } }) => (
                            <List.Subheader>{title}</List.Subheader>
                        )}
                        renderItem={({ item }) => (
                            <ProductListItem
                                isChecked={item.driver.id === selectedItemId}
                                title={item.title}
                                description={item.description ? [item.eta.formattedValue, item.description] : item.eta.formattedValue}
                                price={item.fees[ACCOUNTING_ITEMS.total].formattedValue}
                                chips={item.chips}
                                onPress={() => onItemPress(item)} />
                        )}
                        ListHeaderComponent={listHeaderComponent}
                        //ListFooterComponent={listFooterComponent}
                        stickySectionHeadersEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                ) : null}
            </BottomSheet>
        </>
    );
};

export default RideAndSharingCheckout;
