import React from 'react';

import {  SectionList } from 'react-native';

import {  Divider, FAB, HelperText, List, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import Accounting from '../Accounting/Accounting';
import TipsFilter from '../TipsFilter/TipsFilter';
import LocationListItem, { LOCATION_LIST_ITEM } from '../LocationListItem/LocationListItem';
import { localized } from '../Localization/Localization';
import ProductListItem from './ProductListItem';
import { keyExtractor } from '../CartList/CartList';
import JMSStyles from '../styles';

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
    onTipsPercentPress ,
    onRequestRidePress
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
            <Divider style={{ marginBottom: MD3LightTheme.spacing.x1 }} />
        </>
    );

    const ListFooterComponent = () => (
        <>
            <TipsFilter
                options={tipsFilter.options}
                description={tipsFilter.description}
                selectedTipsPercentIndex={tipsFilter.selectedTipsPercentIndex}
                onTipsPercentPress={onTipsPercentPress}  />
            {fees?.length ? (
                <>
                    <Divider style={{ marginTop: MD3LightTheme.spacing.x4 }} />
                    <ScreenWrapper.Section>
                        <Accounting feeList={fees} style={{ marginTop: MD3LightTheme.spacing.x4 }} />
                    </ScreenWrapper.Section>
                    <ScreenWrapper.Section>
                        <HelperText padding='none' >{localized('checkoutTermAndCondition')}</HelperText>
                    </ScreenWrapper.Section>
                </>
            ) : null}
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
            />
            <FAB label={localized('requestRide')} onPress={onRequestRidePress} style={JMSStyles.button}  />
        </>
      )
};



export default RideAndSharingCheckout;
