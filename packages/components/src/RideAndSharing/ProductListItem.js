import React from 'react';

import { Chip, MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';
import {FIELD_TYPES} from "@jmstechnologiesinc/commons";

import * as JMSList from '../List/List';
import { StyleSheet } from 'react-native';

const ProductListItem = ({ 
    title,
    description,
    price,
    chips,
    onPress
 }) => (
    <JMSList.CheckRadio
        type={FIELD_TYPES.radio}
        title={title}
        description={description}
        metaTitle={price}
        chips={chips?.map(chip => (
        <Chip
            mode="outlined"
            compact
            //icon={ITEM_TYPE_ICON_MAPPING[chip.type]}
            style={styles.chip}>
            {chip}
        </Chip>
    ))} 
    onPress={onPress}/>
)

const styles = StyleSheet.create({
    chip: {
        marginRight: MD3LightTheme.spacing.x2,
    },
  });
  
export default ProductListItem;
