import { List } from '@jmstechnologiesinc/react-native-paper';
import React from 'react';
import { View } from 'react-native';

import * as JMSList from './List';

export default {
    title: 'packages/List',
};

const photo = 'https://d1ralsognjng37.cloudfront.net/9d1e795c-5329-4d96-bdb1-bbf95db0433c.jpeg';

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
