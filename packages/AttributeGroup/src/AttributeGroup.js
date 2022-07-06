import React from 'react';

import { View,StyleSheet, Image, Text } from 'react-native';

import {List} from '@jmsstudiosinc/react-native-paper';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {
  faCheck,
  faChevronRight,
} from '@fortawesome/pro-regular-svg-icons';

const AttributeGroup = ({
  title,
  data,
  id,
  uuid,
  taxonomyType,
  selection,
  minSelection,
  maxSelection,
  isValid,
  formattedSelection,
}) => (
  <List.Section title={title}>
      {data?.map(data => (
        <List.Accordion
            left={props => <List.Icon {...props} icon={faCheck} />}
            right={props => <Text>{data.price}</Text>}
            title={data.title}
            expanded={data.value}
          >
          </List.Accordion>
      ))}
  </List.Section>
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
