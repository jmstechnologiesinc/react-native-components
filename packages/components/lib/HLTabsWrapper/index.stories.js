import React from 'react';

import HLTabsWrapper from './index';

export default {
  title: 'packages/HLTabsWrapper',
};

const options = [
  {title: 'Delivery', value: 'delivery'},
  {title: 'Pickup', value: 'pickup'},
];
const onpress = () => console.log(options[1].value);

export const HLTabsWrappers = () => (
  <HLTabsWrapper
    options={options}
    title={'Shopping mode'}
    value={'delivery'}
    onSelect={onpress}
  />
);
