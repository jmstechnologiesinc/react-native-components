import { localized } from '../Localization/Localization';
import { VENDOR_INDUSTRIES_MAPPING } from '@jmstechnologiesinc/vendor';

export const handleDateOfBirhtChange = (text, inputActionHandler, callback, dateOfBirth) => {
    if ((text.length === 2 && dateOfBirth.length === 3) || (text.length === 5 && dateOfBirth.length === 6)) {
        text = text.slice(0, -1);
    } else if (text.length === 2 || text.length === 5) {
        text += '/';
    }
    callback(text);
    return inputActionHandler('dateofBirth', text);
};

export const OPTIONS = [
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Restaurant.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.GroceryGourmet.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Liquor.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Pharmacy.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.VideoGames.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.LuggageTravelGear.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.ToysGames.title),
    },

    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.GardenOutdoor.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Electronics.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Computers.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.CellPhones.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Books.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.BeautyPersonalCare.title),
    },
    {
        item: localized(VENDOR_INDUSTRIES_MAPPING.Baby.title),
    },
];
