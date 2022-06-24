import React from 'react';
import Button from './components/Button/Button';

export default {
  title: 'packages/Button',
  component: Button,
};

export const Contained = () => (
  <Button mode="contained" onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);

export const Text = () => (
  <Button mode="Text" onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);

export const Outlined = () => (
  <Button mode="Outlined" onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);

export const Elevated = () => (
  <Button mode="elevated" onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);

export const ContainedTonal = () => (
  <Button mode="contained-tonal" onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);


export const Loading = () => (
  <Button mode="contained-tonal" loading onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);




