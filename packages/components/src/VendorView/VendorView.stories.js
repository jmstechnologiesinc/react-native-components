import React from 'react';

import VendorView from './VendorView';

import mockData from '../VendorList/mockData.json';
import ToggleButtonMockData from '../SegmentedButtonGroup/mockData.json';

import { StickyHeader } from '../ProductList/ProductLis.stories';

export default {
    title: 'packages/VendorView',
};

const photos = 'https://cdn.pixabay.com/photo/2017/01/26/02/06/christmas-wallpaper-2009590_1280.jpg';

const Industries = [
    'Restaurant',
    'Clothing',
    'GroceryGourmet',
    'Liquor',
    'Books',
    'CellPhones',
    'Computers',
    'VideoGames',
];

export const Description = () => (
    <StickyHeader
        listHeaderComponent={
            <VendorView
                title={mockData[1].title}
                formatteFulfillmentMethod={`${mockData[0].formattedFulfillmentMethod} - ${mockData[0].formattedHitDistance}`}
                formattedAddress={mockData[1].location.formattedAddress}
                photos={photos}
                description={mockData[1].description}
                formattedErrors={false}
            />
        }
    />
);

export const Banner = () => (
    <StickyHeader
        listHeaderComponent={
            <VendorView
                title={mockData[1].title}
                formatteFulfillmentMethod={`${mockData[0].formattedFulfillmentMethod} - ${mockData[0].formattedHitDistance}`}
                formattedAddress={mockData[1].location.formattedAddress}
                photos={photos}
                formattedErrors={[mockData[1].formattedFulfillmentMethods.description]}
            />
        }
    />
);

export const StickyProductList = () => (
    <StickyHeader
        listHeaderComponent={
            <VendorView
                title={mockData[1].title}
                industryTitle="Industries"
                fulfillmentMethodTitle="Filfillment Methods"
                formatteFulfillmentMethod={`${mockData[0].formattedFulfillmentMethod} - ${mockData[0].formattedHitDistance}`}
                formattedAddress={mockData[1].location.formattedAddress}
                photos={photos}
                fulfillmentMethodOptions={ToggleButtonMockData.subLabelButtons}
                industryList={Industries}
                industryFilter={'Liquor'}
                isMultiProducts={true}
                catalogFilter={0}
                selectedFulfillmentMethod="pickup"
                formattedErrors={false}
            />
        }
    />
);
