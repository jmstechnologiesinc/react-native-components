import React, { useState } from 'react';

import RideAndSharingCheckout from './RideAndSharingCheckout';

import mockData from "../Accounting/mockData.json"
import ScreenWrapper from '../ScreenWrapper/ScreenWrapper';

export default {
  title: 'packages/RideAndSharing',
};

const tipsFilter = {
  "description": "100% of your tips go to support your courier. Tips are calculated based on your order total of  $10.49 ",
  "selectedTipsPercentIndex": 2,
  "options": [
    {
      "value": 0,
      "formattedValue": "0"
    },
    {
      "value": 3,
      "formattedValue": "3%"
    },
    {
      "value": 5,
      "formattedValue": "5%"
    },
    {
      "value": 10,
      "formattedValue": "10%"
    },
    {
      "value": 13,
      "formattedValue": "13%"
    },
    {
      "value": 16,
      "formattedValue": "16%"
    },
    {
      "value": 19,
      "formattedValue": "19%"
    }
  ]
}

const products = [{
  title: 'Recomended',
  data: [
    {
      id: 12434,
      title: "Uber Parcel",
      description: ["3 mins - 11 mils", "Affordable rides all to yourself"],
      price: "$100",
    },
    {
      id: 12434,
      title: "Uber Green",
      description: ["4 mins - 13 mils", "Affordable rides in eco-friendly cars"],
      price: "$200",
      chips: ['4 Passagers', 'Eco Friendly']
    }
  ]
},
{
  title: 'Economy',
  data: [
    {
      id: 12434,
      title: "Share",
      description: ["1 Seat Only"],
      price: "$100",
    },
  ]
}]

export const Pricing = () => {
  return (
    <ScreenWrapper>
      <ScreenWrapper.Container>
        <RideAndSharingCheckout 
          originLocationTitle={"155 Boxford St, Lawrence MA 01843"}
          originLocationDescription={"Origin Location"}
          dropoffLocationTitle={"2 Railroad St, Lawrence MA 01841"}
          dropoffLocationDescription={"Drop off Location"}
          tipsFilter={tipsFilter}
          products={products}
          fees={ mockData}
          originLocationOnPress={() => null}
          dropoffLocationOnPress={() => null}
          onItemPress={() => null}
          onTipsPercentPress={() => null} />
      </ScreenWrapper.Container>
    </ScreenWrapper>
  )
}





