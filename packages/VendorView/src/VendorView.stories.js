import React from 'react';

import VendorView from './VendorView';

import mockData from "../../VendorList/src/mockData.json";
import ToggleButtonMockData from "../../ToggleButton/src/mockData.json";
import { Sticky } from '../../ProductList/src/ProductList.stories';
  
export default {
  title: 'packages/VendorView',
};

const photos = ["./wrecked-ship.jpg"];

export const Basic = () => <VendorView 
  title={mockData[0].title} 
  formattedAddress={mockData[0].location.formattedAddress}
  formattedPud={`${mockData[0].formattedPub} - ${mockData[0].formattedHitDistance}`}
  photos={photos}
  description={mockData[0].description} />

export const Info = () => <VendorView 
  title={mockData[1].title} 
  formattedPud={`${mockData[0].formattedPub} - ${mockData[0].formattedHitDistance}`}
  formattedAddress={mockData[1].location.formattedAddress}
  photos={photos}/>

export const Banner = () => <VendorView 
  title={mockData[1].title} 
  formattedPud={`${mockData[0].formattedPub} - ${mockData[0].formattedHitDistance}`}
  formattedAddress={mockData[1].location.formattedAddress}
  photos={photos}
  banner={"Use your Uber account to order delivery from Terra Luna Cafe in Lawrence. Browse the menu, view popular items, and track your order."}
  description={mockData[1].description} />

 export const StickyProductList = () => (
  <Sticky 
    ListHeaderComponent={(coverTranslateY, coverScale, tabBarOpacity) => {
      return <VendorView 
        title={mockData[1].title} 
        formattedPud={`${mockData[0].formattedPub} - ${mockData[0].formattedHitDistance}`}
        formattedAddress={mockData[1].location.formattedAddress}
        photos={photos}
        coverTranslateY={coverTranslateY} 
        coverScale={coverScale}
        pud={ToggleButtonMockData}
        selectedPud={1}
        tabBarOpacity={tabBarOpacity}/>
    }}
  />
)