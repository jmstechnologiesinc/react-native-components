import React from 'react';
import { ScrollView, View } from 'react-native';

import {TextWrapper} from './TextWrapper';

export default {
  title: 'components/TextWrapper',
  component: TextWrapper,
} ;

const gutterBottom = {
  marginBottom: 14
}

export const Heading = () => (
  <ScrollView>
    <TextWrapper style={gutterBottom} variant="h1">Heading h1</TextWrapper>
    <TextWrapper style={gutterBottom} variant="h2">Heading h2</TextWrapper>
    <TextWrapper style={gutterBottom} variant="h3">Heading h3</TextWrapper>
    <TextWrapper style={gutterBottom} variant="h4">Heading h4</TextWrapper>
    <TextWrapper style={gutterBottom} variant="h5">Heading h5</TextWrapper>
    <TextWrapper style={gutterBottom} variant="h6">Heading h6</TextWrapper>
    <TextWrapper style={gutterBottom} variant="subtitle1">subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenet</TextWrapper>
    <TextWrapper style={gutterBottom} variant="subtitle2">subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur</TextWrapper>
    <TextWrapper style={gutterBottom} variant="body1">body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.</TextWrapper>
    <TextWrapper style={gutterBottom} variant="body2">body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.</TextWrapper>
    <TextWrapper style={gutterBottom} variant="button">BUTTON TEXT</TextWrapper>
    <TextWrapper style={gutterBottom} variant="caption">caption text</TextWrapper>
    <TextWrapper style={gutterBottom} variant="overline">OVERLINE TEXT</TextWrapper>
  </ScrollView>
);
