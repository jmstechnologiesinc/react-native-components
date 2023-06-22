import { List } from '@jmstechnologiesinc/react-native-paper';
import React from 'react';
import { View } from 'react-native';

import * as JMSList from './List';

export default {
    title: 'packages/List',
};

const photo =
    'https://ik.imagekit.io/sog7th7xvupr/o/vendors%2FAHwW%2Bi2vQAKFUcuRPJUq0Q%3A0.jpeg?alt=media&token=ce6576d6-5aec-4a3f-91e4-ef7032f6e5eb';

export const Image = () => (
    <List.Item
        title="Headline"
        description="Supporting text"
        left={(props) => <List.Image variant="video" style={props.style} source={photo} />}
    />
);

export const OneLineImage = () => (
    <JMSList.Item photo={photo} title="NinjaFongo Churrasco (skirt steak)" metaTitle={34.45} onPress={() => {}} />
);

export const TwoLinesImage = () => (
    <JMSList.Item
        photo={photo}
        title="NinjaFongo Churrasco (skirt steak)"
        description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."
        metaTitle={34.45}
        onPress={() => {}}
    />
);

export const TwoLinesImageQuanity = () => (
    <JMSList.Item
        photo={photo}
        title="NinjaFongo Churrasco (skirt steak)"
        description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."
        metaTitle={34.45}
        metaQuantity={3}
        onPress={() => {}}
    />
);

export const OneLineItem = () => (
    <JMSList.Item title="NinjaFongo Churrasco (skirt steak)" metaTitle={34.45} onPress={() => {}} />
);

export const TwoLinesItem = () => (
    <JMSList.Item
        title="NinjaFongo Churrasco (skirt steak)"
        description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."
        metaTitle={34.45}
        onPress={() => {}}
    />
);

export const TwoLinesItemQuantity = () => (
    <JMSList.Item
        title="NinjaFongo Churrasco (skirt steak)"
        description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."
        metaTitle={34.45}
        metaQuantity={3}
        onPress={() => {}}
    />
);
