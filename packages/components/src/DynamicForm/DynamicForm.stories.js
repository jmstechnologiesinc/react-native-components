import React, { useState } from 'react';

import {FIELD_TYPES} from "@jmstechnologiesinc/commons";
import DynamicForm from './DynamicForm';

import mockData from "./mockData.json";
import DynamicFormSwitch from './DynamicFormSwitch';
import * as JMSList from '../List/List';
import { Chip } from '@jmstechnologiesinc/react-native-paper';

export default {
  title: 'packages/DynamicForm',
};

export const AttributeGroup = () => {
  const [productInCart, setProductIncart] = useState('clicks', {
    "attributeGroup": {
      "8e56d219-2237-50b6-a359-6c9381c7a6e3": {
        "taxonomyType": "attributeGroup",
        "id": "8e56d219-2237-50b6-a359-6c9381c7a6e3",
        "title": "Select Option",
        "parentId": null,
        "quantity": 1,
        "formattedQuantity": "Required",
        "isValid": true
      },
      "8eb89ad2-ff06-51a9-84b6-189c899e11a3": {
        "parentId": "8e56d219-2237-50b6-a359-6c9381c7a6e3",
        "title": "Spicy Crispy Chicken Sandwich Meal Large",
        "value": true
      },
      "3fcd47c4-09f6-45d0-96af-60cac412187f": {
        "id": "3fcd47c4-09f6-45d0-96af-60cac412187f",
        "value": true,
        "isDisabled": null,
        "parentId": "8ee273ae-23ea-499a-a440-7220c2a8a0e6",
        "title": "Medium Diet Coke®",
      },
      "root": {
        "isValid": false
      }
    }
  });

  return <DynamicForm
    initialValues={productInCart.attributeGroup}
    isOutofStock={productInCart.isOutofStock}
    parentId={'root'}
    sections={mockData}
    ListHeaderComponent={() => null}
    listFooterComponent={() => null}
    listBottomComponent={() => null}
    onSettingTypeItemPress={() => null}
    onFormChange={(alteredFormDict) => {
      console.log(alteredFormDict)
      setProductIncart({
        ...productInCart,
        attributeGroup: {
          ...productInCart.attributeGroup,
          ...alteredFormDict
        }
      })
    }}
  />
}

export const AttributeGroup1 = () => {
  const [productInCart, setProductIncart] = useState('clicks', {
    "attributeGroup": {
      "8e56d219-2237-50b6-a359-6c9381c7a6e3": {
        "taxonomyType": "attributeGroup",
        "id": "8e56d219-2237-50b6-a359-6c9381c7a6e3",
        "title": "Select Option",
        "parentId": null,
        "quantity": 1,
        "formattedQuantity": "Required",
        "isValid": true
      },
      "8eb89ad2-ff06-51a9-84b6-189c899e11a3": {
        "parentId": "8e56d219-2237-50b6-a359-6c9381c7a6e3",
        "title": "Spicy Crispy Chicken Sandwich Meal Large",
        "value": true
      },
      "3fcd47c4-09f6-45d0-96af-60cac412187f": {
        "id": "3fcd47c4-09f6-45d0-96af-60cac412187f",
        "value": true,
        "isDisabled": null,
        "parentId": "8ee273ae-23ea-499a-a440-7220c2a8a0e6",
        "title": "Medium Diet Coke®",
      },
      "root": {
        "isValid": false
      }
    }
  });

  return (
    <>
      <JMSList.CheckRadio
        type={FIELD_TYPES.radio}
        title="Uber Parcel"
        description={["3 mins - 11 mils", "Affordable rides all to yourself"]}
        metaTitle="$100" />

      <JMSList.CheckRadio
        type={FIELD_TYPES.radio}
        title="Uber Green"
        metaTitle="$100"
        description={["4 mins - 13 mils", "Affordable rides in eco-friendly cars"]}
        chips={<Chip
          mode="outlined"
          //icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
          style={{}}>
          4
        </Chip>}/>
    </>
  )
}

const styles = StyleSheet.create({
  chip: {
      marginRight: MD3LightTheme.spacing.x2,
  },
});


