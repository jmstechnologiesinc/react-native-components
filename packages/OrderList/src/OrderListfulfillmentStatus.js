import React from 'react';

import { StyleSheet,View } from 'react-native';

import {Chip, List, Avatar, Text} from '@jmsstudiosinc/react-native-paper';

import * as JMSList from "../../List/src";

const OrderListfulfillmentStatus = ({
  overline,
  header,
  subHeader,
  avatar,
  chips,
  eta
}) => <List.Section>
    <JMSList.Item 
        overline={overline}
        title={header}
        left={avatar ? () => <Avatar.Image size={40} style={{margin: 8, marginRight: 0}} source={avatar}/> : null}
        right={eta ? () => <Chip>{eta}</Chip> : null}
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
            >
              {subHeader}
            </Text>
            {chips?.length > 0 && <View style={[styles.container, styles.row, styles.additionalPadding]}>
              {chips.map(chip => <Chip mode="outlined">{chip}</Chip>)}
            </View>}
          </View>
    )} />
</List.Section>


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
  }
});
      

export default OrderListfulfillmentStatus;
