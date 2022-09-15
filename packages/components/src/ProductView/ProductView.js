import React from 'react';

import { View } from 'react-native';

import { Text, List, MD3LightTheme, Paragraph } from '@jmsstudiosinc/react-native-paper';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

const ProductView = ({ title, photos, description, inStock, price }) => {
    const renderTitle = ({ selectable, titleEllipsizeMode, color }) => (
        <Text
            selectable={selectable}
            ellipsizeMode={titleEllipsizeMode}
            numberOfLines={1}
            variant={'headlineSmall'}
            style={{ color }}
        >
            {title}
        </Text>
    );

    return (
        <>
            <PhotoGallery photos={photos} />
            <List.Section>
                <List.Item
                    /*    style={{padding: 0}}
                    itemStyle={{padding: 0}} */
                    title={renderTitle}
                    description={'in stock'}
                    right={() => (
                        <Text
                            variant="headlineSmall"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: MD3LightTheme.colors.onSurfaceVariant,
                            }}
                        >
                            {price}
                        </Text>
                    )}
                />
            </List.Section>
            {description && (
                <View style={{ marginHorizontal: 16, marginBottom: 32 }}>
                    <Paragraph>{description}</Paragraph>
                </View>
            )}
        </>
    );
};

export default ProductView;
