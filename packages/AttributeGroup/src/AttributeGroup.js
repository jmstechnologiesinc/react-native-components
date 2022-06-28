import React from 'react';

import { View,StyleSheet, Image, Text } from 'react-native';

import * as List from '../../ReactNativePaper/components/List/List';
import Chip from '../../ReactNativePaper/components/Chip/Chip';
import Badge from '../../ReactNativePaper/components/Badge';

const AttributeGroup = ({
    id,
    uuid,
    photo,
    title,
    description,
    subheader,
    price,
    quantity,
    isOutofStock,
    onPress
}) => (
  <List.AccordionGroup
      expandedId={"1"}
      onAccordionPress={() => {}}
    >
      <List.Section title="Controlled Accordion Group example">
        <List.Accordion
          left={props => <List.Icon {...props} icon="folder" />}
          title="Expandable list item"
          description="ddd"
          id="1"
        >
          <List.Item title="List item 1" />
          <List.Item title="List item 2" />
        </List.Accordion>
        <List.Accordion
          left={props => <List.Icon {...props} icon="folder" />}
          title="Expandable list item 2"
          id="2"
        >
          <List.Item title="List item 1" />
        </List.Accordion>
        <List.Accordion
          left={props => <List.Icon {...props} icon="folder" />}
          title="Expandable list item 2"
          id="3"
        >
          <List.Item title="Another item" />
        </List.Accordion>
      </List.Section>
    </List.AccordionGroup>
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
  

export default AttributeGroup;
