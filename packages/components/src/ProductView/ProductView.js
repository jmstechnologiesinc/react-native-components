import React from 'react';

import { Text, List, MD3LightTheme } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

const ProductView = ({ title, photos, description, inStock, price }) => {
    return (
        <>
            <PhotoGallery photos={photos} />
            <List.Section>
                <JMSList.Item
                    overline={'in stock'}
                    title={title}
                    description={description}
                    titleVariant={'headlineSmall'}
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
        </>
    );
};

export default ProductView;
