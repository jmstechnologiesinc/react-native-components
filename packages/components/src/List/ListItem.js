import React from 'react';

import {List, Text} from '@jmsstudiosinc/react-native-paper';
import * as JMSList from "./List";
import { View } from 'react-native';

const ListItem = ({
    photo,
    overline,
    title,
    description,
    metaTitle,
    metaQuantity,
    right,
    onPress,
    titleNumberOfLines = 1,
    titleVariant="bodyLarge",
    metaTitleVariant,
    style,
    titleStyle,
    metaTitleStyle,
    ...rests
}) => {
  const renderTitle = ({selectable, titleEllipsizeMode, color}) => (
    <View style={{flex: 1}}>
      {overline && <Text variant="labelSmall">{overline}</Text>}
      {!!title && <Text
          selectable={selectable}
          ellipsizeMode={titleEllipsizeMode}
          numberOfLines={titleNumberOfLines}
          variant={titleVariant}
          style={[{ color }, titleStyle]}>
          {title}
        </Text>}
    </View>
  );

  const renderRight = right ? right : (metaTitle || metaQuantity) ? 
    () => <JMSList.MetaBadged
      title={metaTitle} 
      quantity={metaQuantity}
      titleVariant={metaTitleVariant} /> : 
    null

  return photo ? (
    <JMSList.Image 
      src={{uri: photo}}
      title={title}
      right={renderRight}
      titleNumberOfLines={titleNumberOfLines}
      description={description}
      metaTitle={metaTitle}
      metaQuantity={metaQuantity}
      metaTitleVariant={metaTitleVariant}
      onPress={onPress}
      style={style}
      {...rests}/>
  ) : (
    <List.Item
      right={renderRight}
      title={renderTitle}
      description={description}
      onPress={onPress}
      style={style}
      {...rests}/>
  )
} 

export default ListItem;
