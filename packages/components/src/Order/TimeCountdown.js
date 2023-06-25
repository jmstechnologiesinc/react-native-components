import React from 'react';

<<<<<<< HEAD
import {Chip, ActivityIndicator} from '@jmstechnologiesinc/react-native-paper';
=======
import { Chip, ActivityIndicator } from '@jmstechnologiesinc/react-native-paper';
>>>>>>> d865414856e4517f93137ed4ff48e05d5247aa32

import { milliseconsExtractor, formattedETATime } from '@jmstechnologiesinc/commons';

const TimeCountdown = ({ milliseconds }) => {
    if (milliseconds === undefined) {
        return null;
    }

    const { hrs, mins } = milliseconsExtractor(milliseconds);

    return hrs || mins ? (
        <Chip mode="outlined">{formattedETATime(hrs, mins)}</Chip>
    ) : (
        <ActivityIndicator animating={true} />
    );
};

export default TimeCountdown;
