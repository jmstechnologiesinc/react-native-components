import React from 'react';

import {View, StyleSheet, Image } from 'react-native';

import * as List from '../../ReactNativePaper/components/List/List';
import Text from '../../ReactNativePaper/components/Typography/Text';
import Button from '../../ReactNativePaper/components/Button/Button';
import Badge from '../../ReactNativePaper/components/Badge';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {
  faCheck,
  faChevronRight,
  faWallet,
  faCalendar,
} from '@fortawesome/pro-regular-svg-icons';
import Divider from '../../ReactNativePaper/components/Divider';
import ListSubheader from '../../ReactNativePaper/components/List/ListSubheader';
import { CART_ITEM_TYPE } from '@jmsstudiosinc/cart';
import Snackbar from '../../ReactNativePaper/components/Snackbar';
import Banner from '../../ReactNativePaper/components/Banner';
import * as Avatar from '../../ReactNativePaper/components/Avatar/Avatar';

const vendorPhoto = "https://d1ralsognjng37.cloudfront.net/21abd571-1fa3-4214-ae02-2e828864dea3.jpeg";

const recursiveAttributeGroup = ({ parentId, attributeGroup }) => {
  const results = [];

  if (!parentId) return null;

  for (selection in attributeGroup) {
      if (attributeGroup[selection].parentId === parentId) {
        results.push({
          ...attributeGroup[selection],
          ...recursiveAttributeGroup({parentId: selection, attributeGroup})
        });
      }
  }

  return results;
};

const renderRecursiveAttributeGroup = (attributeGroup) => {
  const results = [];
  for (index in attributeGroup) {
      if (attributeGroup[index].parentId === null) {
          results.push(...recursiveAttributeGroup({parentId: attributeGroup[index].id, attributeGroup}));
      }
  }

  return results;
};

const CartItem = ({
  id,
  title,
  type,
  total,
  description,
  data
}) => {
  if (type === CART_ITEM_TYPE.emptyItem) {
    return null;
  } else if (type === CART_ITEM_TYPE.checkout) {
    return  <Button mode="contained" onPress={() => {}} style={styles.button}>CHECKOUT</Button>
  } else if (type === "industryWarning") {
    return  <View style={{marginTop: 40, marginBottom: 20}}>
      <Text variant={"headlineMedium"}>{title}</Text>
      <Text variant={"bodyMedium"}>{description}</Text>
    </View>
  }  else if (type === CART_ITEM_TYPE.industryTitle) {
    return null
    return <List.Section title={title} style={{margin: 0}}></List.Section>
  }

  return (
    <List.Section>
     <List.Item
        style={{padding: 0}}
        itemStyle={{marginVertical: 0, paddingLeft: 0}}
        title={title ? () => <ListSubheader>{title}</ListSubheader> : null}
        left={() => <Avatar.Image size={40} style={styles.avatar} source={vendorPhoto}/>}
        right={false ? () => right : null}
      />
          
      {data?.map(data => {
        const attributeGroup = renderRecursiveAttributeGroup(data.attributeGroup);

        return (  
          <List.Accordion
              title={data.title}
              left={() => <List.Icon icon={() => <Badge style={{alignSelf: "auto"}}>{data.quantity}</Badge>} />}
              right={() => data.price ? <Text>{data.price}</Text> : null}
              expanded={attributeGroup.length > 0}>
                {attributeGroup.map(item =>  <List.Item title={item.title} />)}
          </List.Accordion>
        )
      })}
    </List.Section>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 40,
    width: 40,
    margin: 8,
  },
  image1: {
    width: 100,
    height: 56,
    padding: 0
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  button: {
    margin: 16
  },
  avatar: {
    margin: 8,
    marginRight: 0
  }
});

export default CartItem;
