import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import HLTabsWrapper from './index';

export default {
  title: 'components/MyButton',
  component: HLTabsWrapper,
} as ComponentMeta<typeof HLTabsWrapper>;

const options = [
  {title: 'Delivery', value: 'delivery'},
  {title: 'Pickup', value: 'pickup'},
  {title: 'Taxi', value: 'taxi'},
];

export const Basic: ComponentStory<typeof HLTabsWrapper> = () => (
  <HLTabsWrapper options={options} />
);
