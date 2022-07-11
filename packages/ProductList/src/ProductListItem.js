import React from 'react';

import { View,StyleSheet, Image } from 'react-native';

import {List, Chip, Text} from '@jmsstudiosinc/react-native-paper';
import {Metadata} from "../../List/src";

const ProductListItem = ({
    id,
    uuid,
    photo,
    title,
    description,
    price,
    quantity,
    isOutofStock,
    onPress
}) => (
  <List.Section>
    <List.Item
      onPress={onPress}
      left={photo ? () => <Image source={{uri: photo}} style={styles.image} /> : null}
      right={() => <Metadata title={price} />}
      title={title}
      description={({
        ellipsizeMode,
        color: descriptionColor,
        fontSize,
      }) => (
        <View style={[styles.container, styles.column]}>
          <Text
            numberOfLines={2}
            ellipsizeMode={ellipsizeMode}
            style={{ color: descriptionColor, fontSize }}
          >{description}</Text>
          <View style={[styles.container, styles.row, { paddingTop: 8 }]}>
            {isOutofStock ? <Chip disabled>Out of Stock</Chip> : null}         
            {/* {quantity ? <Badge>{quantity}</Badge> : null} */}
          </View>
        </View>
      )}
    />
  </List.Section> 
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 56
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  button: {
    margin: 4,
  },
  });

export default ProductListItem;
