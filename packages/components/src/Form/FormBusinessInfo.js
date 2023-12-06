import React from 'react';

import { TextInput, HelperText, Divider, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING, VENDOR_INDUSTRIES } from '@jmstechnologiesinc/vendor';

import ScreenWrapper from '@jmstechnologiesinc/react-native-components/lib/ScreenWrapper/ScreenWrapper';
import { localized } from '@jmstechnologiesinc/react-native-components/lib/Localization/Localization';
import OptionPickerActionSheet from '@jmstechnologiesinc/react-native-components/lib/OptionPicker/OptionPickerActionSheet';
import SecretInputText from './SecretInputText';

export const INDUSTRY_LIST = [
    {
        title: VENDOR_INDUSTRIES_MAPPING.Restaurant.title,
        id: VENDOR_INDUSTRIES.Restaurant,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.DomincanBodega.title,
        description: VENDOR_INDUSTRIES_MAPPING.DomincanBodega.description,
        id: VENDOR_INDUSTRIES.DomincanBodega,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.StreetFoodCart.title,
        description: VENDOR_INDUSTRIES_MAPPING.StreetFoodCart.description,
        id: VENDOR_INDUSTRIES.StreetFoodCart,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.GroceryGourmet.title,
        description: VENDOR_INDUSTRIES_MAPPING.GroceryGourmet.description,
        id: VENDOR_INDUSTRIES.GroceryGourmet,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.Liquor.title,
        description: VENDOR_INDUSTRIES_MAPPING.Liquor.description,
        id: VENDOR_INDUSTRIES.Liquor,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.Convinience.title,
        description: VENDOR_INDUSTRIES_MAPPING.Convinience.description,
        id: VENDOR_INDUSTRIES.Convinience,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.CoffeShop.title,
        description: VENDOR_INDUSTRIES_MAPPING.CoffeShop.description,
        id: VENDOR_INDUSTRIES.CoffeShop,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.Pharmacy.title,
        id: VENDOR_INDUSTRIES.Pharmacy,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.Flower.title,
        id: VENDOR_INDUSTRIES.Flower,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.PetSupplies.title,
        id: VENDOR_INDUSTRIES.PetSupplies,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.BeautyPersonalCare.title,
        id: VENDOR_INDUSTRIES.BeautyPersonalCare,
    },

    {
        title: VENDOR_INDUSTRIES_MAPPING.ToysGames.title,
        id: VENDOR_INDUSTRIES.ToysGames,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.Electronics.title,
        id: VENDOR_INDUSTRIES.Electronics,
    },
    {
        title: VENDOR_INDUSTRIES_MAPPING.CellPhones.title,
        id: VENDOR_INDUSTRIES.CellPhones,
    },
];

const FormBusinessInfo = ({
    isDisabled,
    title = localized('businessDetails'),
    description,
    storeTitle,
    location,
    line2,
    showWebsite = true,
    showPhoneNumber = true,
    showEmail = true,
    showTIN = false,
    tin,
    website,
    phone,
    email,
    inputActionHandler,
    industries,
}) => {
    return (
        <>
            <ScreenWrapper.Container>
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
                        value={location}
                        disabled={isDisabled}
                        onChangeText={(text) => inputActionHandler('location', text)}
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

                {showPhoneNumber ? (
                    <ScreenWrapper.Section>
                        <TextInput
                            mode="outlined"
                            label={localized('phoneNumber')}
                            value={phone}
                            disabled={isDisabled}
                            onChangeText={(text) => inputActionHandler('phone', text)}
                        />
                        <HelperText>{localized('helpTextStorePhoneNumber')}</HelperText>
                    </ScreenWrapper.Section>
                ) : null}
                {showEmail ? (
                    <ScreenWrapper.Section>
                        <TextInput
                            mode="outlined"
                            label={localized('email')}
                            value={email}
                            disabled={isDisabled}
                            onChangeText={(text) => inputActionHandler('email', text)}
                        />
                        <HelperText>{localized('helpTextStoreEmail')}</HelperText>
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
                        <HelperText>{localized('noWebsiteEnterSocialMedia')}</HelperText>
                    </ScreenWrapper.Section>
                ) : null}
                {showTIN ? (
                    <ScreenWrapper.Section>
                        <TextInput
                            mode="outlined"
                            label={localized('taxIdentificationNumber')}
                            value={tin}
                            secureTextEntry
                            disabled={isDisabled}
                            onChangeText={(text) => inputActionHandler('tin', text)}
                        />
                        <HelperText>{localized('helpTextTaxIdentificationNumber')}</HelperText>
                    </ScreenWrapper.Section>
                ) : null}
            </ScreenWrapper.Container>

            <Divider style={{ marginTop: MD3LightTheme.spacing.x1 }} />
            <ScreenWrapper.Container>
                <OptionPickerActionSheet
                    isDisabled={isDisabled}
                    chipListTitle={localized('Industries')}
                    addButtonTitle={localized('pick')}
                    helpText={localized('helpTextIndustries')}
                    preSelectedOptions={industries}
                    options={INDUSTRY_LIST.map((industry) => {
                        return {
                            ...industry,
                            title: localized(industry.title),
                            description: localized(industry.description),
                        };
                    })}
                    onPress={(selectedOptions) => inputActionHandler('industries', selectedOptions)}
                />
            </ScreenWrapper.Container>
        </>
    );
};

export default FormBusinessInfo;
