import React from 'react';
import { View } from 'react-native';

import * as JMSList from './List';

export default {
    title: 'packages/List',
};

const photos =
    'https://ik.imagekit.io/sog7th7xvupr/o/vendors%2FAHwW%2Bi2vQAKFUcuRPJUq0Q%3A0.jpeg?alt=media&token=ce6576d6-5aec-4a3f-91e4-ef7032f6e5eb';

export const MetadataTitle = () => <JMSList.MetaBadged title="$2.99" />;

export const MetaBadged = () => (
    <View style={{ flexDirection: 'row' }}>
        <JMSList.MetaBadged title="$2.99" quantity={9} />
    </View>
);

export const OneLineImage = () => (
    <JMSList.Image
        src={{ uri: photos }}
        title="NinjaFongo Churrasco (skirt steak)"
        right={() => <JMSList.MetaBadged title={34.45} />}
    />
);
export const TwoLinesImage = () => (
    <JMSList.Image
        src={{ uri: photos }}
        title="NinjaFongo Churrasco (skirt steak)"
        description="Chicken tempura, cream cheese, maduro, guacamole, and chicken teriyaki."
    />
);
