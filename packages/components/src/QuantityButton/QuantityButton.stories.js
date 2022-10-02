import React from 'react';

import QuantityButton from './QuantityButton';

import useState from 'storybook-addon-state';

export default {
  title: 'packages/QuantityButton',
};

export const Basic = () => {
  const [value, setValue] = useState(0);

  return <QuantityButton value={value} onPress={setValue} />
}