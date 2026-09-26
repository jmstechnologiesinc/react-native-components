import React from 'react';

import CodeBlock from './CodeBlock';

export default {
    title: 'packages/CodeBlock',
};

export const Json = () => (
    <CodeBlock
        accessibilityLabel="Simulation result"
        value={{ decision: 'review', reasons: ['document_expired'], score: 0.42 }}
    />
);

export const Expression = () => <CodeBlock value={'vehicle.year >= 2012 and insurance.expires_at > today()'} />;
