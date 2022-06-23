import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import HLTabsWrapper from './index';

export default {
  title: 'packages/HLTabsWrapper',
  component: HLTabsWrapper,
} as ComponentMeta<typeof HLTabsWrapper>;

const options = [
  {title: 'Delivery', value: 'delivery'},
  {title: 'Pickup', value: 'pickup'},
];
const onpress = () => console.log(options[1].value);

export const Basic: ComponentStory<typeof HLTabsWrapper> = () => (
  <HLTabsWrapper
    options={options}
    title={'Shopping mode'}
    value={'delivery'}
    onSelect={onpress}
  />
);
