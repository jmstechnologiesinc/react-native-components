/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
} from '@storybook/react-native';

import '@storybook/addon-ondevice-notes/register';
import '@storybook/addon-ondevice-controls/register';
import '@storybook/addon-ondevice-backgrounds/register';
import '@storybook/addon-ondevice-actions/register';

import {argsEnhancers} from '@storybook/addon-actions/dist/modern/preset/addArgs';

import {decorators, parameters} from './preview';

if (decorators) {
  decorators.forEach(decorator => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

// temporary fix for https://github.com/storybookjs/react-native/issues/327 whilst the issue is investigated
try {
  argsEnhancers.forEach(enhancer => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return [
    require('../components/Buttons/Buttons.stories'),
    require('../components/ListItem/ListItem.stories'),
    require('../components/CheckBox/CheckBox.stories'),
    require('../components/Text/Text.stories'),
    require('../components/Card/Card.stories'),
    require('../components/Badge/Badge.stories'),
    require('../components/Divider/Divider.stories'),
    require('../components/Banner/Banner.stories'),
    require('../components/ActivityIndicator/ActivityIndicator.stories'),
  ];
};

configure(getStories, module, false);
