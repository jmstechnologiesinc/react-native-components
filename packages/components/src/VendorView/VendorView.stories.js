import React from 'react';

import VendorView from './VendorView';

import mockData from '../VendorList/mockData.json';
import ToggleButtonMockData from '../SegmentedButtonGroup/mockData.json';

import { StickyHeader } from '../ProductList/ProductLis.stories';

export default {
    title: 'packages/VendorView',
};

const photos = [
    'https://ik.imagekit.io/sog7th7xvupr/o/vendors%2FAHwW%2Bi2vQAKFUcuRPJUq0Q%3A0.jpeg?alt=media&token=ce6576d6-5aec-4a3f-91e4-ef7032f6e5eb',
];

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
        listHeaderComponent={(
            <VendorView
                title={mockData[1].title}
                formatteFulfillmentMethod={`${mockData[0].formattedFulfillmentMethod} - ${mockData[0].formattedHitDistance}`}
                formattedAddress={mockData[1].location.formattedAddress}
                photos={photos}
                description={mockData[1].description}
            />
        )}
    />
);

export const Banner = () => (
    <StickyHeader
        listHeaderComponent={<VendorView
            title={mockData[1].title}
            formatteFulfillmentMethod={`${mockData[0].formattedFulfillmentMethod} - ${mockData[0].formattedHitDistance}`}
            formattedAddress={mockData[1].location.formattedAddress}
            photos={photos}
            bannerMessages={[
                'Use your Uber account to order delivery from Terra Luna Cafe in Lawrence. Browse the menu, view popular items, and track your order.'
            ]}
        />}
    />
);

export const StickyProductList = () => (
    <StickyHeader
        listHeaderComponent={<VendorView
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
        />}
    />
);
