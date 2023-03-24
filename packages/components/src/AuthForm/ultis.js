 
 import { localized } from '../Localization/Localization';
 import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';

 export const OPTIONS = [
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Restaurant.title),
            selected: true
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.GroceryGourmet.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Liquor.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Pharmacy.title),
            selected: false
        },
    ]