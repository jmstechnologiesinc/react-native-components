import React from 'react';

import { View,StyleSheet, Image } from 'react-native';

import * as List from '../../ReactNativePaper/components/List/List';
import Chip from '../../ReactNativePaper/components/Chip/Chip';
import Badge from '../../ReactNativePaper/components/Badge';
import Divider from '../../ReactNativePaper/components/Divider';
import Text from '../../ReactNativePaper/components/Typography/Text';

const Item = ({
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
      right={() => <Text variant="bodySmall">{price}</Text>}
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

export default Item;
