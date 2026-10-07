import React from 'react';

import { HelperText, Divider, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

import { VENDOR_INDUSTRIES_MAPPING, VENDOR_INDUSTRIES } from '@jmstechnologiesinc/vendor';

import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import OptionPickerActionSheet from '../OptionPicker/OptionPickerActionSheet';

import SecretInputText from './SecretInputText';
import FormField, { ChangedHelperText, FieldErrorText, isHighlighted } from './FormField';

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
    readOnly = false,
    highlightFields,
    errors,
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
    // P-3: the merchant's legal entity, shown with the tax id. `tinOnFile` is the stored tin as the server
    // answers it (masked); `taxIdTypeLabel` names its kind (EIN, RNC, RUC).
    legalName,
    taxAddress,
    taxIdTypeLabel,
    tinOnFile,
    website,
    phoneNumber,
    email,
    inputActionHandler,
    industries,
}) => {
    const disabled = Boolean(isDisabled || readOnly);

    return (
        <>
            <ScreenWrapper.Container>
                <ScreenWrapper.Section title={title}>
                    <FormField
                        mode="outlined"
                        field="title"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'title')}
                        disabled={disabled}
                        label={localized('storeName')}
                        value={storeTitle}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('title', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="description"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'description')}
                        disabled={disabled}
                        label={localized('storeHighlightsDescription')}
                        value={description}
                        onChangeText={(text) => inputActionHandler('description', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="location"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'location')}
                        disabled={disabled}
                        label={localized('storeAddress')}
                        value={location}
                        autoCapitalize="words"
                        onChangeText={(text) => inputActionHandler('location', text)}
                    />
                </ScreenWrapper.Section>
                <ScreenWrapper.Section>
                    <FormField
                        mode="outlined"
                        field="line2"
                        errors={errors}
                        highlighted={isHighlighted(highlightFields, 'line2')}
                        disabled={disabled}
                        label={localized('floorSuite')}
                        value={line2}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        onChangeText={(text) => inputActionHandler('line2', text)}
                    />
                </ScreenWrapper.Section>

                {showPhoneNumber ? (
                    <ScreenWrapper.Section>
                        <FormField
                            mode="outlined"
                            field="phoneNumber"
                            errors={errors}
                            highlighted={isHighlighted(highlightFields, 'phoneNumber')}
                            disabled={disabled}
                            label={localized('phoneNumber')}
                            value={phoneNumber}
                            keyboardType="numeric"
                            onChangeText={(text) => inputActionHandler('phoneNumber', text)}
                        />
                        <HelperText>{localized('helpTextStorePhoneNumber')}</HelperText>
                    </ScreenWrapper.Section>
                ) : null}
                {showEmail ? (
                    <ScreenWrapper.Section>
                        <FormField
                            mode="outlined"
                            field="email"
                            errors={errors}
                            highlighted={isHighlighted(highlightFields, 'email')}
                            disabled={disabled}
                            label={localized('email')}
                            value={email}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            onChangeText={(text) => inputActionHandler('email', text)}
                        />
                        <HelperText>{localized('helpTextStoreEmail')}</HelperText>
                    </ScreenWrapper.Section>
                ) : null}
                {showWebsite ? (
                    <ScreenWrapper.Section>
                        <FormField
                            mode="outlined"
                            field="website"
                            errors={errors}
                            highlighted={isHighlighted(highlightFields, 'website')}
                            disabled={disabled}
                            label={localized('website')}
                            value={website}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                            onChangeText={(text) => inputActionHandler('website', text)}
                        />
                        <HelperText>{localized('noWebsiteEnterSocialMedia')}</HelperText>
                    </ScreenWrapper.Section>
                ) : null}
                {showTIN ? (
                    <>
                        <ScreenWrapper.Section>
                            <FormField
                                mode="outlined"
                                field="legalName"
                                errors={errors}
                                highlighted={isHighlighted(highlightFields, 'legalName')}
                                disabled={disabled}
                                label={localized('legalBusinessName')}
                                value={legalName}
                                autoCapitalize="words"
                                onChangeText={(text) => inputActionHandler('legalName', text)}
                            />
                            <HelperText>{localized('helpTextLegalBusinessName')}</HelperText>
                        </ScreenWrapper.Section>
                        <ScreenWrapper.Section>
                            <FormField
                                input={SecretInputText}
                                mode="outlined"
                                field="tin"
                                errors={errors}
                                highlighted={isHighlighted(highlightFields, 'tin')}
                                disabled={disabled}
                                label={
                                    taxIdTypeLabel
                                        ? `${localized('taxIdentificationNumber')} (${taxIdTypeLabel})`
                                        : localized('taxIdentificationNumber')
                                }
                                value={tin}
                                onChangeText={(text) => inputActionHandler('tin', text)}
                            />
                            <HelperText>
                                {tinOnFile
                                    ? localized('helpTextTaxIdentificationNumberOnFile', { tin: tinOnFile })
                                    : localized('helpTextTaxIdentificationNumber')}
                            </HelperText>
                        </ScreenWrapper.Section>
                        <ScreenWrapper.Section>
                            <FormField
                                mode="outlined"
                                field="taxAddress"
                                errors={errors}
                                highlighted={isHighlighted(highlightFields, 'taxAddress')}
                                disabled={disabled}
                                label={localized('taxAddress')}
                                value={taxAddress}
                                autoCapitalize="words"
                                onChangeText={(text) => inputActionHandler('taxAddress', text)}
                            />
                            <HelperText>{localized('helpTextTaxAddress')}</HelperText>
                        </ScreenWrapper.Section>
                    </>
                ) : null}
            </ScreenWrapper.Container>

            <Divider style={{ marginTop: MD3LightTheme.spacing.x1 }} />
            <ScreenWrapper.Container>
                <OptionPickerActionSheet
                    isDisabled={disabled}
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
                <ChangedHelperText visible={isHighlighted(highlightFields, 'industries')} />
                <FieldErrorText field="industries" errors={errors} />
            </ScreenWrapper.Container>
        </>
    );
};

export default FormBusinessInfo;
