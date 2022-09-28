import React from 'react';

import { View } from 'react-native';

import {Chip, ActivityIndicator} from '@jmsstudiosinc/react-native-paper';

import { milliseconsExtractor, formattedETATime } from '@jmsstudiosinc/commons';

const ChipCountdown = ({milliseconds}) => {

    if(milliseconds === undefined) {
        return null
    }

    const {hrs, mins} = milliseconsExtractor(milliseconds);
   
    return (
        <View>
            {(hrs || mins) ? (
                <Chip>{formattedETATime(hrs, mins)}</Chip>
            ) :  (
                <ActivityIndicator animating={true} />
            )}
        </View>
    )
}

export default ChipCountdown;
