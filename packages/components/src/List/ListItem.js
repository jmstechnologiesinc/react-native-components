import React from 'react';

import {List, Text} from '@jmsstudiosinc/react-native-paper';
import * as JMSList from "./List";
import { StyleSheet, View } from 'react-native';

const ListItem = ({
    photo,
    title,
    description,
    chips,
    metaTitle,
    metaQuantity,
    left,
    right,
    onPress,
    titleNumberOfLines,
    descriptionNumberOfLines,
    titleVariant,
    metaTitleVariant,
    style,
    titleStyle,
    descriptionStyle,
    metaTitleStyle,
    ...rests
}) => {
  const renderTitle = ({selectable, titleEllipsizeMode, color, fontSize}) => (
    <View style={[styles.container, styles.row, styles.customTitle]}>
      {!!title && <Text
          selectable={selectable}
          ellipsizeMode={titleEllipsizeMode}
          numberOfLines={titleNumberOfLines}
          variant={titleVariant}
          style={[{ color,  ...(!titleVariant && {fontSize}) }, titleStyle]}>
          {title}
        </Text>}
    </View>
  );

  const renderDescription = Array.isArray(description) ? ({
      ellipsizeMode,
      color: descriptionColor,
      fontSize,
  }) => {
    
    return (
      <View style={[styles.container, styles.column]}>
        {description.map((item, index) => (
          <View style={index === 0 ? null : [styles.container, styles.row, styles.additionalPadding]}>
              <Text
                numberOfLines={2}
                ellipsizeMode={ellipsizeMode}
                style={{ color: descriptionColor, fontSize }}>
                {item}
              </Text>
          </View>
        ))}
        {chips ? (
          <View style={[styles.container, styles.row, styles.additionalPadding]}>
              {chips}
          </View>
        ) : null}
      </View>
    )
} : description;

  const renderLeft = photo ? (props) => (
    <List.Image
      style={props.style}
      source={{uri: photo}}
    />
  ): left;
  
  const renderRight = right ? right : (metaTitle || metaQuantity) ? 
    () => <JMSList.MetaBadged
      title={metaTitle} 
      quantity={metaQuantity}
      titleVariant={metaTitleVariant} /> : 
    null

  return (
    <List.Item
      title={renderTitle}
      description={renderDescription}
      left={renderLeft}
      right={renderRight}
      titleNumberOfLines={titleNumberOfLines}
      descriptionNumberOfLines={descriptionNumberOfLines}
      onPress={onPress}
      style={style}
      {...rests} 
    />
  )
} 

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  row: {
      flexDirection: 'row',
  },
  column: {
      flexDirection: 'column',
  },
  additionalPadding: {
      paddingTop: 8,
  },
  customTitle: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ListItem;
