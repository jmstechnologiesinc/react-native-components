import React from 'react';

import { SectionList } from 'react-native';

import { FAB, List } from '@jmstechnologiesinc/react-native-paper';
import TipsFilter from '../TipsFilter/TipsFilter';
import {ACCOUNTING_ITEMS} from "@jmstechnologiesinc/cart";
import LocationListItem, { LOCATION_LIST_ITEM } from '../LocationListItem/LocationListItem';
import { localized } from '../Localization/Localization';
import ProductListItem from './ProductListItem';
import { keyExtractor } from '../CartList/CartList';
import styles from '../styles';

import CheckoutSummary from '../CheckoutSummary/CheckoutSummary'

const RideAndSharingCheckout = ({
    originLocationTitle,
    originLocationDescription,
    dropoffLocationTitle,
    dropoffLocationDescription,
    cart,
    selectedProductIndex,
    fees,
    tipsFilter,
    originLocationOnPress,
    dropoffLocationOnPress,
    onItemPress,
    onTipsPercentPress,
    onRequestRidePress,
    RenderPaymentMethod
}) => {
    const listHeaderComponent = () => (
        <>
            <List.Section title="Shipping Details">
                <LocationListItem
                    title={originLocationTitle}
                    description={originLocationDescription}
                    variant={LOCATION_LIST_ITEM.currentLocation}
                    onPress={originLocationOnPress} />
                <LocationListItem
                    title={dropoffLocationTitle}
                    description={dropoffLocationDescription}
                    variant={LOCATION_LIST_ITEM.currentLocation}
                    onPress={dropoffLocationOnPress} />
            </List.Section>
            {RenderPaymentMethod ? (
                <List.Section title={localized("paymentMethod")}>
                    <RenderPaymentMethod />
                </List.Section> 
            ): null}
        </>
    );

    const ListFooterComponent = () => (
        <>
            {tipsFilter ? (
                <TipsFilter
                    options={tipsFilter.options}
                    description={tipsFilter.description}
                    selectedTipsPercentIndex={tipsFilter.selectedTipsPercentIndex}
                    onTipsPercentPress={onTipsPercentPress} />
            ): null}

            {fees ? (
                <CheckoutSummary
                    netFeeList={fees}
                    termsAndConditions={'checkoutTermAndCondition'} />
            ) : null}
        </>
    );

    return (
        <>
            <SectionList
                sections={cart.products}
                keyExtractor={keyExtractor}
                renderSectionHeader={({ section: { title } }) => (
                    <List.Subheader >
                        {title}
                    </List.Subheader>
                )}
                renderItem={({ item }) => (
                    <ProductListItem
                        isChecked={item.driver.id === selectedProductIndex}
                        title={item.title}
                        description={item.description ? [item.eta.formattedValue, item.description] : item.eta.formattedValue}
                        price={item.fees[ACCOUNTING_ITEMS.total].formattedValue}
                        chips={item.chips}
                        onPress={() => onItemPress(item.driver.id)} />
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={listHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                stickySectionHeadersEnabled={false}
            />
            <FAB label={localized('requestRide')} onPress={onRequestRidePress} style={styles.fba} />
        </>
    )
};



export default RideAndSharingCheckout;
