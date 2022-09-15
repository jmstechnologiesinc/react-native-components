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
      right={() => <JMSList.MetaBadged 
        title={metaTitle} 
        quantity={metaQuantity} 
        titleStyle={{marginTop: -6}} />
      }
      {...props}
      src={{uri: photo}}
      title={title}
      onPress={onPress} />
  ) : (
    <List.Item
      right={() => <JMSList.MetaBadged 
        title={metaTitle} 
        quantity={metaQuantity} />
      }
      {...props}
      title={renderTitle}
      onPress={onPress}/>
  )
} 

export default ListItem;
