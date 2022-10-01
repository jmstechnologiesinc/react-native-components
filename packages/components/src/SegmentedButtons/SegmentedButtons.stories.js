import * as React from 'react';
import { StyleSheet } from 'react-native';

import useState from 'storybook-addon-state';
import SegmentedButtons from './SegmentedButtons';

export default {
    title: 'packages/SegmentedButton ',
};

export const SegmentedButton = () => {
    const [value, setValue] = useState();

    const data = [
        {
            value: 'walk',
            icon: 'walk',
            label: 'Walking',
            style: styles.button,
        },
        {
            value: 'train',
            icon: 'train',
            label: 'Transit',
            style: styles.button,
        },
        {
            value: 'drive',
            icon: 'car',
            label: 'Driving',
            style: styles.button,
        },
    ];

    return <SegmentedButtons title="Segmented Button" value={value} setValue={setValue} data={data} />;
};

export const SegmentedButtonDisabled = () => {
    const [value, setValue] = useState();

    const data = [
        {
            value: 'walk',
            label: 'Walking',
            style: styles.button,
        },
        {
            value: 'disabled',
            label: 'Disabled',
            disabled: true,
            style: styles.button,
        },
        {
            value: 'drive',
            label: 'Driving',
            style: styles.button,
        },
    ];

    return <SegmentedButtons title="Segmented Button" value={value} setValue={setValue} data={data} />;
};

export const SegmentedButtonMultiselect = () => {
    const [value, setValue] = useState([]);

    const data = [
        {
            style: styles.button,
            value: 'walk',
            label: 'Walking',
            showSelectedCheck: true,
        },
        {
            style: styles.button,
            value: 'transit',
            label: 'Transit',
            showSelectedCheck: true,
        },
        {
            style: styles.button,
            value: 'drive',
            label: 'Driving',
            showSelectedCheck: true,
        },
    ];

    return <SegmentedButtons title="Segmented Button" value={value} setValue={setValue} data={data} />;
};

export const SegmentedButtonWithDensity = () => {
    const [value, setValue] = useState();

    const data = [
        {
            style: styles.button,
            value: 'walk',
            label: 'Walking',
        },
        {
            style: styles.button,
            value: 'transit',
            label: 'Transit',
        },
        {
            style: styles.button,
            value: 'drive',
            label: 'Driving',
        },
    ];

    return <SegmentedButtons title="Segmented Button" value={value} setValue={setValue} data={data} />;
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
    },
});
