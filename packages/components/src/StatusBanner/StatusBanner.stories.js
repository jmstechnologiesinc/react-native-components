import React from 'react';
import { View } from 'react-native';

import StatusBanner from './StatusBanner';

export default {
    title: 'packages/StatusBanner',
};

export const Tones = () => (
    <View>
        <StatusBanner
            tone="info"
            message="This rule set is a draft."
            actions={[{ label: 'Publish', onPress: () => {} }]}
        />
        <StatusBanner tone="success" message="All documents are verified." />
        <StatusBanner tone="warning" message="The insurance expires in 12 days." />
        <StatusBanner
            tone="danger"
            message="The driver license has expired."
            actions={[{ label: 'Request a new one', onPress: () => {} }]}
        />
        <StatusBanner tone="neutral" message="No background check yet." icon={null} />
    </View>
);
