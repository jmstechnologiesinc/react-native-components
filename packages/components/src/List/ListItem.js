import React from 'react';

import {List, MD3LightTheme, Text} from '@jmsstudiosinc/react-native-paper';
import * as JMSList from "./List";
import { StyleSheet, ScrollView } from 'react-native';

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
    titleNumberOfLines = 1,
    descriptionNumberOfLines = 2,
    titleVariant,
    descriptionVariant,
    metaTitleVariant,
    style,
    titleStyle,
    descriptionStyle,
    metaTitleStyle,
    ...rests
}) => {
  const renderTitle = titleVariant ? ({selectable, titleEllipsizeMode, color}) => (
    <Text
      selectable={selectable}
      ellipsizeMode={titleEllipsizeMode}
      numberOfLines={titleNumberOfLines}
      variant={titleVariant}
      style={{ color, titleStyle}}>
      {title}
    </Text>
  ) : title;

  const renderDescription = Array.isArray(description) ? ({
      selectable,
      ellipsizeMode,
      color: descriptionColor,
      fontSize,
  }) => (
    <>
      {description.map((item, index) => (
        <Text
            selectable={selectable}
            numberOfLines={index === 0 ? descriptionNumberOfLines : 0}
            ellipsizeMode={ellipsizeMode}
            variant={descriptionVariant && index === 0 && descriptionVariant}
            style={{ 
              color: descriptionColor, 
              ...(index === 0 && descriptionVariant ? null : {fontSize}),
              ...(index === 0 ? descriptionStyle : styles.additionalPadding) 
            }}>
            {item}
        </Text>
      ))}
      {chips ? (
        <ScrollView 
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} 
        horizontal
        style={[styles.chips, styles.additionalPadding]}>
            {chips}
        </ScrollView>
      ) : null}
  </>
  ) : description;

  const renderLeft = photo ? (props) => (
    <List.Image
      style={props.style}
      source={{uri: photo}}
    />
  ): left;
  
  const renderRight = right ? right : (metaTitle || metaQuantity) ? 
    (props) => (
      <JMSList.MetaBadged
        title={metaTitle} 
        quantity={metaQuantity}
        titleVariant={metaTitleVariant}
        titleStyle={{color: props.color}} /> 
    ) : null

  return (
    <List.Item
      title={renderTitle}
      description={renderDescription}
      left={renderLeft}
      right={renderRight}
      titleVariant={titleVariant}
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
      marginTop: MD3LightTheme.spacing.x2,
  },
  chips: {
      flexDirection: 'row',
      flexWrap: 'wrap'
  },
  customTitle: {
    alignItems: 'center',
    justifyContent: "space-between"
  },
});

export default ListItem;
