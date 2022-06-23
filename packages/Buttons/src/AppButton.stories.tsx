import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import AppButton from './AppButton';

export default {
  title: 'packages/AppButton',
  component: AppButton,
} as ComponentMeta<typeof AppButton>;

export const Basic: ComponentStory<typeof AppButton> = () => (
  <AppButton title="JMS EATS" onPress={() => console.log('hey there!')} />
);
