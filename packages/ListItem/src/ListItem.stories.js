import React, { useState } from 'react';
import { View,StyleSheet,ScrollView, Image, Text } from 'react-native';
import Chip from '../../ReactNativePaper/components/Chip/Chip';
import Divider from '../../ReactNativePaper/components/Divider';

import List from './ListItem';

export default {
  title: 'packages/List',
};

export const SingleLine = () => (
  <ScrollView
>
  <List.Section>
    <List.Subheader>Single line</List.Subheader>
    <List.Item
      left={props => <List.Icon {...props} icon="calendar" />}
      title="List item 1"
    />
    <List.Item
      left={props => <List.Icon {...props} icon="wallet-giftcard" />}
      title="List item 2"
    />
    <List.Item
      title="List item 3"
      left={props => <List.Icon {...props} icon="folder" />}
      right={props => <List.Icon {...props} icon="equal" />}
    />
  </List.Section>
  </ScrollView>
);

export const TwoLine = () => (
  <ScrollView
>
  <List.Section>
    <List.Subheader>Two line</List.Subheader>
    <List.Item
      left={() => (
        <Image
          source={require('./email-icon.png')}
          style={styles.image}
        />
      )}
      title="List item 1"
      description="Describes item 1"
    />
    <List.Item
      left={() => (
        <Image
          source={require('./email-icon.png')}
          style={styles.image}
        />
      )}
      right={props => <List.Icon {...props} icon="information" />}
      title="List item 2"
      description="Describes item 2"
    />
    </List.Section>
  </ScrollView>
);

export const ThreeLine = () => (
  <ScrollView
>
  <List.Section>
    <List.Subheader>Three line</List.Subheader>
      <List.Item
        left={() => (
          <Image
          source={require('./email-icon.png')}
            style={styles.image}
          />
        )}
        title="List item 1"
        description="Describes item 1. Example of a very very long description."
      />
      <List.Item
        left={() => (
          <Image
          source={require('./email-icon.png')}
            style={styles.image}
          />
        )}
        right={props => <List.Icon {...props} icon="star-outline" />}
        title="List item 2"
        description="Describes item 2. Example of a very very long description."
      />
    </List.Section>
  </ScrollView>
);

export const CustomDescription = () => (
  <ScrollView
>
  <List.Section>
    <List.Subheader>Custom description</List.Subheader>
      <List.Item
          left={() => (
            <Image
            source={require('./email-icon.png')}
            style={styles.image}
            />
          )}
          right={props => <List.Icon {...props} icon="star-outline" />}
          title="List Item 1"
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
                React Native Paper is a high-quality, standard-compliant
                Material Design library that has you covered in all major
                use-cases.
              </Text>
              <View style={[styles.container, styles.row, { paddingTop: 8 }]}>
                <Chip icon="file-pdf" onPress={() => {}}>
                  DOCS.pdf
                </Chip>
              </View>
            </View>
          )}
        />
      </List.Section>
  </ScrollView>
);

export const ListAccordion = () => {
  //const [expanded, setExpanded] = useState(true);

  const _handlePress = () => {
   // setExpanded(!expanded);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: 'white' }]}>
      <List.Section title="Expandable list item">
        <List.Accordion
          left={props => <List.Icon {...props} icon="folder" />}
          title="Expandable list item"
        >
          <List.Item title="List item 1" />
          <List.Item title="List item 2" />
        </List.Accordion>
        <List.Accordion
          left={props => <List.Icon {...props} icon="folder" />}
          title="Start expanded"
          expanded={true}
          onPress={_handlePress}
        >
          <List.Item title="List item 1" />
        </List.Accordion>
      </List.Section>
      <Divider />
      <List.Section title="Expandable & multiline list item">
        <List.Accordion
          title="Expandable list item"
          description="Describes the expandable list item"
        >
          <List.Item title="List item 1" />
          <List.Item title="List item 2" />
        </List.Accordion>
      </List.Section>
      <Divider />
      <List.Section title="Expandable list with icons">
        <List.Accordion
          left={props => <List.Icon {...props} icon="star" />}
          title="Accordion item 1"
        >
          <List.Item
            left={props => <List.Icon {...props} icon="thumb-up" />}
            title="List item 1"
          />
          <List.Item
            left={props => <List.Icon {...props} icon="thumb-down" />}
            title="List item 2"
          />
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
};

export const ListAccordionGroup = () => {
  //const [expandedId, setExpandedId] = useState(undefined);

  const _onAccordionPress = (newExpandedId) =>
    expandedId === newExpandedId
      ? setExpandedId(undefined)
      : setExpandedId(newExpandedId);
/* 
  const {
    colors: { background },
  } = useTheme(); */

  return (
    <ScrollView style={[styles.container, { backgroundColor: 'white' }]}>
      <List.AccordionGroup>
        <List.Section title="Uncontrolled Accordion">
          <List.Accordion
            left={props => <List.Icon {...props} icon="folder" />}
            title="Expandable list item"
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
      <List.AccordionGroup
        expandedId={1}
        onAccordionPress={_onAccordionPress}
      >
        <List.Section title="Controlled Accordion Group">
          <List.Accordion
            left={props => <List.Icon {...props} icon="folder" />}
            title="Expandable list item"
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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




