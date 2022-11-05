import React from 'react';

import { StyleSheet, Image } from 'react-native';

import { List, MD3LightTheme, Text } from '@jmsstudiosinc/react-native-paper';
import { moderateScale } from 'react-native-size-matters';

const ListImage = ({
    src,
    title,
    description,
    right,
    titleNumberOfLines,
    metaTitle,
    metaQuantity,
    metaTitleVariant,
    ...props
}) => {
  const renderImage = src ? () => <Image source={src} style={styles.image}  /> : null;
  const renderTitle = ({selectable, titleEllipsizeMode, color}) => (
    <Text
      selectable={selectable}
      ellipsizeMode={titleEllipsizeMode}
      numberOfLines={titleNumberOfLines}
      variant={"bodyLarge"}
      style={{ color, paddingLeft: MD3LightTheme.spacing.x2}}>
      {title}
    </Text>
  );

  return (
      <List.Item
        {...props}
        title={renderTitle}
        description={description}
        left={renderImage}
        right={right}
        style={{paddingLeft: 0}}
        descriptionStyle={{paddingLeft: MD3LightTheme.spacing.x2}}
        itemStyle={{marginVertical: 0, justifyContent: "center"}} />
  )
}

const styles = StyleSheet.create({
    image: {
        width: moderateScale(100),
        height: MD3LightTheme.spacing.x14,
    },
});

export default ListImage;
