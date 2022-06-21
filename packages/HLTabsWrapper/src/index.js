import React from 'react';

import { Text } from 'react-native';

import HLTabs from './HLTabs';

import styles from './styles';

const HLTabsWrapper = ({ title, value, onSelect, options = [] }) => {
    return (
        <>
            {options.length > 0 && title && <Text style={styles.optionTopTitle}>{title}</Text>}

            <HLTabs options={options} value={value} onSelect={onSelect} />
        </>
    );
};

export default HLTabsWrapper;
