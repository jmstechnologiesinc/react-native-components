import React from 'react';

import { StyleSheet, Image, Platform } from 'react-native';

import {List, Text} from '@jmsstudiosinc/react-native-paper';

const ListImage = ({
    src,
    title,
    description,
    right,
    ...props
}) => {
  const renderImage = src ? () => <Image source={src} style={styles.image}  /> : null;
  const renderTitle = ({selectable, titleEllipsizeMode, color}) => (
    <Text
      selectable={selectable}
      ellipsizeMode={titleEllipsizeMode}
      numberOfLines={1}
      variant={"bodyLarge"}
      style={{ color, paddingLeft: 12, marginTop: Platform.OS === 'web' ? -6 : -12 }}>
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
        titleStyle={{paddingLeft: 12}}
        descriptionStyle={{paddingLeft: 12}}
        itemStyle={{marginVertical: 0, justifyContent: description ? "flex-start" : "center"}} />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 56
  }
});

export default ListImage;
