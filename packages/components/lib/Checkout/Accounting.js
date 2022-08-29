import React from 'react';

import { Text, List } from '@jmsstudiosinc/react-native-paper';
import { Metadata } from '../List';
import { MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

const Accounting = ({ fees }) => {
    const results = [];

    const { total, ...rest } = fees;
    
    for (index in rest) {
        const { label, description, formattedValue } = rest[index];

        if (Array.isArray(rest[index])) {
            results.push(
                rest[index].map(({ label, description, formattedValue }) => (
                    <List.Item
                        style={{ paddingVertical: 0 }}
                        title={label}
                        description={description}
                        right={() => (
                            <Metadata title={formattedValue} style={{ color: MD3LightTheme.colors.onSurfaceVariant }} />
                        )}
                    />
                ))
            );
        }

        results.push(
            <List.Item
                style={{ paddingVertical: 0 }}
                title={label}
                description={description}
                right={() => (
                    <Metadata title={formattedValue} style={{ color: MD3LightTheme.colors.onSurfaceVariant }} />
                )}
            />
        );
    }

    const renderTitle = ({ selectable, titleEllipsizeMode, color }) => (
        <Text
            selectable={selectable}
            ellipsizeMode={titleEllipsizeMode}
            numberOfLines={1}
            variant={'headlineSmall'}
            style={{ color }}
        >
            {total.label}
        </Text>
    );

    return (
        <List.Section>
            <List.Item
                title={renderTitle}
                description={total.description}
                right={() => (
                    <Text
                        variant="headlineSmall"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {total.formattedValue}
                    </Text>
                )}
            />
            {results}
        </List.Section>
    );
};

export default Accounting;
