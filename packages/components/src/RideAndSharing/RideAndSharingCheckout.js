import React from 'react';

import { SectionList } from 'react-native';

import { Divider, FAB, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import TipsFilter from '../TipsFilter/TipsFilter';
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
    products,
    fees,
    tipsFilter,
    originLocationOnPress,
    dropoffLocationOnPress,
    onItemPress,
    onTipsPercentPress,
    onRequestRidePress,
    isPaymentMethodVisible = true,
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
            {
                isPaymentMethodVisible ? <>
                    <Divider style={{ marginBottom: MD3LightTheme.spacing.x1 }} />
                    <RenderPaymentMethod />
                    <Divider style={{ marginBottom: MD3LightTheme.spacing.x1 }} />
                </> : null
            }

        </>
    );

    const ListFooterComponent = () => (
        <>
            <TipsFilter
                options={tipsFilter.options}
                description={tipsFilter.description}
                selectedTipsPercentIndex={tipsFilter.selectedTipsPercentIndex}
                onTipsPercentPress={onTipsPercentPress} />

            <CheckoutSummary
                netFeeList={fees}
                termsAndConditions={'checkoutTermAndCondition'}
            />

        </>
    );

    return (
        <>
            <SectionList
                sections={products}
                keyExtractor={keyExtractor}
                renderSectionHeader={({ section: { title } }) => (
                    <List.Subheader >
                        {title}
                    </List.Subheader>
                )}
                renderItem={({ item }) => (
                    <ProductListItem
                        title={item.title}
                        description={item.description}
                        price={item.price}
                        chips={item.chips}
                        onPress={onItemPress} />
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
