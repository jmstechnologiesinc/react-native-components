import React from 'react';
import { View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from './States';

export default {
    title: 'packages/States',
};

// Each state fills its pane: the stories give them one.
const Pane = ({ children }) => <View style={{ height: 320 }}>{children}</View>;

export const Empty = () => (
    <Pane>
        <EmptyState
            title="Nothing waiting"
            description="New tasks show up here."
            actionLabel="Refresh"
            actionIcon="refresh"
            onAction={() => {}}
        />
    </Pane>
);

export const Loading = () => (
    <Pane>
        <LoadingState />
    </Pane>
);

export const Failure = () => (
    <Pane>
        <ErrorState description="The server did not answer." onRetry={() => {}} />
    </Pane>
);
