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
    require('../packages/components/lib/List/List.stories.js'),
    require('../packages/components/src/CartList/CartList.stories.js'),
    require('../packages/components/src/Checkout/Checkout.stories.js'),
    require('../packages/components/src/ChipList/index.stories.js'),
    require('../packages/components/src/DynamicForm/DynamicForm.stories.js'),
    require('../packages/components/src/IndustriesTaps/IndustriesTabs.stories.js'),
    require('../packages/components/src/List/List.stories.js'),
    require('../packages/components/src/OrderList/OrderList.stories.js'),
    require('../packages/components/src/OrderView/OrderView.stories.js'),
    require('../packages/components/src/PhotoGallery/PhotoGallery.stories.js'),
    require('../packages/components/src/ProductList/ProductList.stories.js'),
    require('../packages/components/src/ProductView/ProductView.stories.js'),
    require('../packages/components/src/StickyList/StickyList.stories.js'),
    require('../packages/components/src/Tabs/Tabs.stories.js'),
    require('../packages/components/src/ToggleButton/ToggleButton.stories.js'),
    require('../packages/components/src/VendorList/VendorList.stories.js'),
    require('../packages/components/src/VendorView/VendorView.stories.js'),
  ];
};

configure(getStories, module, false);
