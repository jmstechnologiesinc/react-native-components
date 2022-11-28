import React from 'react';

import {Chip, ActivityIndicator} from '@jmsstudiosinc/react-native-paper';

import { milliseconsExtractor, formattedETATime } from '@jmsstudiosinc/commons';

const TimeCountdown = ({milliseconds}) => {

    if(milliseconds === undefined) {
        return null
    }

    const {hrs, mins} = milliseconsExtractor(milliseconds);
   
    return (
        (hrs || mins) ? (
            <Chip mode="outlined">{formattedETATime(hrs, mins)}</Chip>
        ) : (
            <ActivityIndicator animating={true} />
        )
    )
}

export default TimeCountdown;
