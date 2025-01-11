import React, { useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetFooter, BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { Divider, FAB, List, MD3LightTheme, Text } from "@jmstechnologiesinc/react-native-paper";
import TipsFilter from "../TipsFilter/TipsFilter";
import LocationListItem, { LOCATION_LIST_ITEM } from "../LocationListItem/LocationListItem";
import { localized } from "../Localization/Localization";
import ProductListItem from "./ProductListItem";
import { keyExtractor } from "../CartList/CartList";
import styles from "../styles";
import CheckoutSummary from "../CheckoutSummary/CheckoutSummary";

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper'
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GeoPositionTracker from "../GeoPositionTracker";
const RideAndSharingCheckout = ({
    originLocationTitle,
    originLocationDescription,
    dropoffLocationTitle,
    dropoffLocationDescription,
    products,
    fees,
    tipsFilter,
    originLocationOnPress,
    dropoffLocationOnPress,
    onItemPress,
    onTipsPercentPress,
    onRequestRidePress,
    RenderPaymentMethod,
    withBottomInset = true,
    withTopInset = false,
    originLocation,
    dropoffLocation
}) => {
    const bottomSheetRef = useRef(null);


    const snapPoints = useMemo(() => ["50%", "75%", "100%"], []);
    const [currentSnapPoint, setCurrentSnapPoint] = useState(0.5);
    const insets = useSafeAreaInsets();

    const isInsetsBottom = insets.bottom === 0 ? MD3LightTheme.spacing.x4 : insets.bottom;


    const containerStyle = [
        {
            paddingTop: withTopInset ? insets.top : 0,
            paddingBottom: withBottomInset ? isInsetsBottom : 0,
            paddingLeft: insets.left,
            paddingRight: insets.left,

        },
    ]

    const listHeaderComponent = () => (
        <>
            <List.Section title="Shipping Details">
                <LocationListItem
                    title={originLocationTitle}
                    description={originLocationDescription}
                    variant={LOCATION_LIST_ITEM.currentLocation}
                    onPress={originLocationOnPress}
                />
                <LocationListItem
                    title={dropoffLocationTitle}
                    description={dropoffLocationDescription}
                    variant={LOCATION_LIST_ITEM.currentLocation}
                    onPress={dropoffLocationOnPress}
                />
            </List.Section>
            {RenderPaymentMethod ? (
                <List.Section title={localized("paymentMethod")}>
                    <RenderPaymentMethod />
                </List.Section>
            ) : null}
        </>
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


    const renderFooter = useCallback(
        props => (
            <BottomSheetFooter {...props}>
                <ScreenWrapper withScrollView={false} withPaddingHorizontal={false} withBottomInset={true}>
                    <FAB
                        label={localized('requestRide')}
                        variant='secondary'
                        mode="elevated"
                        style={[styles.button]}
                        onPress={onRequestRidePress} />
                </ScreenWrapper>
            </BottomSheetFooter>
        ),
        []
    );

    const getValueFromIndex = (index) => {
        switch (index) {
            case 0:
                return 0.5;
            case 1:
                return 0.3;
            default:
                return 0.5;
        }
    };

    const handleSheetChange = useCallback((index) => {
        const value = getValueFromIndex(index);
        setCurrentSnapPoint(value);
    }, []);


    return (
        <ScreenWrapper withScrollView={false} withPaddingHorizontal={false} withBottomInset={true}>

            <GeoPositionTracker
                customerPosition={{
                    longitude: originLocation.longitude,
                    latitude: originLocation.latitude
                }}
                currentDriverPosition={dropoffLocation}
                vendorPosition={dropoffLocation}
                currentSnapPoint={currentSnapPoint}

            />

            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                footerComponent={renderFooter}
                containerStyle={containerStyle}
                backgroundStyle={{
                    flex: 1,
                    backgroundColor: MD3LightTheme.colors.background,
                }}
                handleStyle={{
                    backgroundColor: MD3LightTheme.colors.background,
                }}
                onChange={handleSheetChange}
            >

                <BottomSheetSectionList
                    sections={products}
                    keyExtractor={keyExtractor}
                    renderSectionHeader={({ section: { title } }) => (
                        <List.Subheader>{title}</List.Subheader>
                    )}
                    renderItem={({ item }) => (
                        <ProductListItem
                            title={item.title}
                            description={item.description}
                            price={item.price}
                            chips={item.chips}
                            onPress={onItemPress}
                        />
                    )}
                    ListHeaderComponent={listHeaderComponent}
                    ListFooterComponent={listFooterComponent}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                />

            </BottomSheet>
        </ScreenWrapper>
    );
};

export default RideAndSharingCheckout;
