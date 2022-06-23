import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {material, human, materialColors, Typography} from '.';

export default {
  title: 'packages/Typography',
  component: Text,
};

const lightSectionGuides= {}

const materialBlackStyles2014 = [
  {
    style: material.display4,
    text: "Light 112",
    name: "display4"
  },
  {
    style: material.display3,
    text: "Regular 56",
    name: "display3"
  },
  {
    style: material.display2,
    text: "Regular 45",
    name: "display2"
  },
  {
    style: material.display1,
    text: "Regular 34",
    name: "display1"
  },
  {
    style: material.headline,
    text: "Regular 24",
    name: "headline"
  },
  {
    style: material.title,
    text: "Medium 20",
    name: "title"
  },
  {
    style: material.subheading,
    text: "Regular 16",
    name: "subheading"
  },
  {
    style: material.body2,
    text: "Medium 14",
    name: "body2"
  },
  {
    style: material.body1,
    text: "Regular 14",
    name: "body1"
  },
  {
    style: material.caption,
    text: "Regular 12",
    name: "caption"
  },
  {
    style: material.button,
    text: "MEDIUM 14",
    name: "button"
  }
];

const humanBlackStyles2014 = [
  {
    style: human.largeTitle,
    text: "Regular 34",
    name: "largeTitle"
  },
  {
    style: human.title1,
    text: "Regular 28",
    name: "title1"
  },
  {
    style: human.title2,
    text: "Regular 22",
    name: "title2"
  },
  {
    style: human.title3,
    text: "Regular 20",
    name: "title3"
  },
  {
    style: human.headline,
    text: "Semi-Bold 17",
    name: "headline"
  },
  {
    style: human.body,
    text: "Regular 17",
    name: "body"
  },
  {
    style: human.callout,
    text: "Regular 16",
    name: "callout"
  },
  {
    style: human.subhead,
    text: "Regular 15",
    name: "subhead"
  },
  {
    style: human.footnote,
    text: "Regular 13",
    name: "footnote"
  },
  {
    style: human.caption1,
    text: "Regular 12",
    name: "caption1"
  },
  {
    style: human.caption2,
    text: "Regular 11",
    name: "caption2"
  }
]

const TextStyles = [
  {
    variant: 'h1',
    text: "Headline 1",
    name: "h1"
  },
  {
    variant: 'h2',
    text: "Headline 2",
    name: "h2"
  },
  {
    variant: 'h3',
    text: "Headline 3",
    name: "h3"
  },
  {
    variant: 'h4',
    text: "Headline 4",
    name: "h4"
  },
  {
    variant: 'h5',
    text: "Headline 5",
    name: "h5"
  },
  {
    variant: 'h6',
    text: "Headline 6",
    name: "h6"
  },
  {
    variant: 'subtitle1',
    text: "Subtitle 1",
    name: "subtitle1"
  },
  {
    variant: 'subtitle2',
    text: "Subtitle 2",
    name: "subtitle2"
  },
  {
    variant: 'body1',
    text: "Body 1",
    name: "body1"
  },
  {
    variant: 'body2',
    text: "Body 2",
    name: "body2"
  },
  {
    variant: 'button',
    text: "Button",
    name: "button"
  },
  {
    variant: 'caption',
    text: "Caption",
    name: "caption"
  },
  {
    variant: 'overline',
    text: "Overline",
    name: "overline"
  }
];


const typeItem = (s) => (
  <View key={s.name}>
    <Text numberOfLines={1} style={[s.style, lightSectionGuides]}>
      {s.text}
    </Text>
    <Text
      numberOfLines={1}
      style={{
        ...human.caption2Object,
        color: materialColors.blackSecondary,
        marginBottom: 4
      }}>
      {s.name}
    </Text>
  </View>
)

export const MaterialDesign2014 = () => (
  <ScrollView style={{}}>
    {materialBlackStyles2014.map(typeItem)}
  </ScrollView>
);

export const HumanDesign2014 = () => (
  <ScrollView style={{}}>
    {humanBlackStyles2014.map(typeItem)}
  </ScrollView>
);

export const Typograph = () => (
  <ScrollView style={{}}>
    {TextStyles.map((s) => (
        <View key={s.name}>
          <Typography numberOfLines={1} variant={s.variant}>
            {s.text}
          </Typography>
          <Text
            numberOfLines={1}
            style={{
              ...human.caption2Object,
              color: materialColors.blackSecondary,
              marginBottom: 4
            }}>
            {s.name}
          </Text>
      </View>
    ))}
  </ScrollView>
);

