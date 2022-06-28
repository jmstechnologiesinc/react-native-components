import React from 'react';

import { View,StyleSheet, Image, Text } from 'react-native';

import * as List from '../../ReactNativePaper/components/List/List';
import Chip from '../../ReactNativePaper/components/Chip/Chip';
import Badge from '../../ReactNativePaper/components/Badge';

const ProductItem = ({
    id,
    uuid,
    photo,
    title,
    description,
    subheader,
    price,
    quantity,
    isOutofStock,
    onPress
}) => (
    <List.Section title={subheader}  >
        <List.Item
          onPress={onPress}
          left={photo ? () => <Image source={{uri: photo}} style={styles.image} /> : null}
          right={() => <Text>{price}</Text>}
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
  

export default ProductItem;
