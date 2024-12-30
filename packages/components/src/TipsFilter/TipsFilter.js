import React from 'react';

import {  Divider, MD3LightTheme, Text } from '@jmstechnologiesinc/react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import { localized } from '../Localization/Localization';
import ChipList from '../ChipList/ChipList';

const TipsFilter = ({ 
    options,
    description,
    selectedTipsPercentIndex,
    onTipsPercentPress ,
}) => {
    return options?.length ? (
        <>
            <Divider style={{ marginTop: MD3LightTheme.spacing.x2 }} />
            <ScreenWrapper.Section title={localized('tips')} withPaddingHorizontal>
                {description ? <Text>{description}</Text> : null}
            </ScreenWrapper.Section>
            <ScreenWrapper.Section withPaddingHorizontal>
                <ChipList
                    options={options.map((item) => item.formattedValue)}
                    currentIndex={selectedTipsPercentIndex}
                    onPress={(tipsIndex) => onTipsPercentPress(tipsIndex)}
                />
            </ScreenWrapper.Section>
        </>
    ) : null;
};

export default TipsFilter;
