import React from 'react';

import { TextInput, Caption } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING,VENDOR_INDUSTRIES } from '@jmstechnologiesinc/vendor';

import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';
import { localized } from '../Localization/Localization';
import OptionPicker from '../OptionPicker/NestedOptionPicker';

export const INDUSTRY_LIST = [
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Restaurant.title),
        value:  VENDOR_INDUSTRIES.Restaurant
    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.GroceryGourmet.title),
        value:  VENDOR_INDUSTRIES.GroceryGourmet

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Liquor.title),
        value:  VENDOR_INDUSTRIES.Liquor

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Pharmacy.title),
        value:  VENDOR_INDUSTRIES.Pharmacy

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.VideoGames.title),
        value:  VENDOR_INDUSTRIES.VideoGames

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.LuggageTravelGear.title),
        value:  VENDOR_INDUSTRIES.LuggageTravelGear

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.ToysGames.title),
        value:  VENDOR_INDUSTRIES.ToysGames

    },

    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.GardenOutdoor.title),
        value:  VENDOR_INDUSTRIES.GardenOutdoor

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Electronics.title),
        value:  VENDOR_INDUSTRIES.Electronics

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Computers.title),
        value:  VENDOR_INDUSTRIES.Computers

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.CellPhones.title),
        value:  VENDOR_INDUSTRIES.CellPhones

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Books.title),
        value:  VENDOR_INDUSTRIES.Books

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.BeautyPersonalCare.title),
        value:  VENDOR_INDUSTRIES.BeautyPersonalCare

    },
    {
        title: localized(VENDOR_INDUSTRIES_MAPPING.Baby.title),
        value:  VENDOR_INDUSTRIES.Baby
    },
];
const AuthFormBusinessInfo = ({
    isDisabled,
    title = localized('businessDetails'),
    description,
    storeTitle,
    fullAddress,
    line2,
    showWebsite = true,
    showPhone = true,
    website,
    phone,
    inputActionHandler,
    industry,
}) => {
    console.log(industry)
    return (
        <>
            <ScreenWrapper.Section title={title}>
                <TextInput
                    mode="outlined"
                    label={localized('storeName')}
                    value={storeTitle}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('title', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('storeHighlightsDescription')}
                    value={description}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('description', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('storeAddress')}
                    value={fullAddress}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('fullAddress', text)}
                />
            </ScreenWrapper.Section>
            <ScreenWrapper.Section>
                <TextInput
                    mode="outlined"
                    label={localized('floorSuite')}
                    value={line2}
                    disabled={isDisabled}
                    onChangeText={(text) => inputActionHandler('line2', text)}
                />
            </ScreenWrapper.Section>
            {showPhone ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('phoneNumber')}
                        value={phone}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('phone', text)}
                    />
                </ScreenWrapper.Section>
            ) : null}
            {showWebsite ? (
                <ScreenWrapper.Section>
                    <TextInput
                        mode="outlined"
                        label={localized('website')}
                        value={website}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('website', text)}
                    />
                    <Caption>
                        {localized(
                            'noWebsiteEnterSocialMedia'
                        )}
                    </Caption>
                </ScreenWrapper.Section>
            ) : null}
           <OptionPicker
                isDisabled={isDisabled}
                chipListTitle={localized('Industries')}
                addButtonTitle={localized('addIndustry')}
                preSelectedOptions={industry}
                options={INDUSTRY_LIST}
                onPress={(selectedOptions) => inputActionHandler('industry', selectedOptions)}
            />
        </>
    );
};

export default AuthFormBusinessInfo;
