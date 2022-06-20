import React from 'react';

import {TextWrapper} from './TextWrapper';

export default {
  title: 'components/TextWrapper',
  component: TextWrapper,
} ;

export const Heading = args => (
  <>
    <TextWrapper h1>{args.text} h1</TextWrapper>
    <TextWrapper h2>{args.text} h2</TextWrapper>
    <TextWrapper h3>{args.text} h3</TextWrapper>
    <TextWrapper h4>{args.text} h4</TextWrapper>
  </>
);

export const Paragraph = args => (
  <>
    <TextWrapper>{args.text}</TextWrapper>
  </>
);

Heading.args = {
  text: 'Hello World'
};

Paragraph.args = {
  text: 'Hello World'
};