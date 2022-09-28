import React from 'react';

import {List, Text} from '@jmsstudiosinc/react-native-paper';
import * as JMSList from ".";

const ListItem = ({
    uuid,
    photo,
    overline,
    title,
    metaTitle,
    metaQuantity,
    onPress,
    titleVariant="bodyLarge",
    metaTitleVariant,
    metaTitleStyle,
    ...props
}) => {
  const renderTitle = ({selectable, titleEllipsizeMode, color}) => (
    <>
      {overline && <Text variant="labelSmall">{overline}</Text>}
      {title && <Text
          selectable={selectable}
          ellipsizeMode={titleEllipsizeMode}
          numberOfLines={1}
          variant={titleVariant}
          style={{ color }}>
          {title}
        </Text>}
    </>
  );

  return photo ? (
    <JMSList.Image 
      right={metaTitle || metaQuantity ? 
        () => <JMSList.MetaBadged 
          title={metaTitle} 
          quantity={metaQuantity} 
          titleStyle={[{marginTop: -6}, metaTitleStyle]}
          titleVariant={metaTitleVariant} /> : 
        null
      }
      {...props}
      src={{uri: photo}}
      title={title}
      onPress={onPress} />
  ) : (
    <List.Item
      right={metaTitle || metaQuantity ? 
        () => <JMSList.MetaBadged 
          title={metaTitle} 
          quantity={metaQuantity}
          titleVariant={metaTitleVariant}
          titleStyle={metaTitleStyle} /> : 
        null
      }
      {...props}
      title={renderTitle}
      onPress={onPress}/>
  )
} 

export default ListItem;
