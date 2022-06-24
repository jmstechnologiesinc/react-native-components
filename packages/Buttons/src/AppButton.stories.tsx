import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import AppButton from './AppButton.tsx';

export default {
  title: 'packages/AppButton/UI',
  component: AppButton,
} as ComponentMeta<typeof AppButton>;

export const Template: ComponentStory<typeof AppButton> = args => (
  <AppButton {...args} />
);

// export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Template.args = {
  title: 'JMS EATS INC',
  onPress: () => console.log('Here there'),
  color: '#281a62',
};
