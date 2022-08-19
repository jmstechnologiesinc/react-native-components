import React from 'react';

import {Headline} from '@jmsstudiosinc/react-native-paper';

import HLTabs from './HLTabs';

import styles from './styles';

const HLTabsWrapper = ({title, value, onSelect, options = []}) => {
  return (
    <>
      {options.length > 0 && title && (
        <Headline style={styles.optionTopTitle}>{title}</Headline>
      )}

      <HLTabs options={options} value={value} onSelect={onSelect} />
    </>
  );
};

export default HLTabsWrapper;
