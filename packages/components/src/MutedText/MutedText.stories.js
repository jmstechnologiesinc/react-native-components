import React from 'react';

import MutedText from './MutedText';

export default {
    title: 'packages/MutedText',
};

export const Body = () => <MutedText>No open tasks</MutedText>;

export const Small = () => <MutedText variant="bodySmall">Updated 2 minutes ago</MutedText>;
