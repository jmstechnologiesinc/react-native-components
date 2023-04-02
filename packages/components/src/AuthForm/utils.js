 
 import { localized } from '../Localization/Localization';
 import { VENDOR_INDUSTRIES_MAPPING } from '@jmsstudiosinc/vendor';




export const handleDateOfBirhtChange = (text, inputActionHandler, callback, dateOfBirth) => {
        if (
            (text.length === 2 && dateOfBirth.length === 3) ||
            (text.length === 5 && dateOfBirth.length === 6)
        ) {
            text = text.slice(0, -1);
        } else if (text.length === 2 || text.length === 5) {
            text += "/";
        }
        callback(text)    
        return inputActionHandler('dateofBirth', text )
}

 export const OPTIONS = [
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Restaurant.title),
            selected: false
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
          {
            item: localized(VENDOR_INDUSTRIES_MAPPING.VideoGames.title),
            selected: false
        },
          {
            item: localized(VENDOR_INDUSTRIES_MAPPING.LuggageTravelGear.title),
            selected: false
        },
          {
            item: localized(VENDOR_INDUSTRIES_MAPPING.ToysGames.title),
            selected: false
        },
       
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.GardenOutdoor.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Electronics.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Computers.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.CellPhones.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Books.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.BeautyPersonalCare.title),
            selected: false
        },
        {
            item: localized(VENDOR_INDUSTRIES_MAPPING.Baby.title),
            selected: false
        },

    ]