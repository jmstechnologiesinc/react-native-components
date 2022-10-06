import React from 'react';

import {  List, Banner } from '@jmsstudiosinc/react-native-paper';

import * as JMSList from '../List/List';
import PhotoGallery from '../PhotoGallery/PhotoGallery';

const ProductView = ({ 
    title, 
    photos, 
    description, 
    price,
    isOutofStock,
    pudErrorMessage
}) => {
    const message = [];

    if(isOutofStock) {
        message.push("This item is out of stock")
    }

    if(pudErrorMessage) {
        message.push(pudErrorMessage)
    }

    return (
        <>
            {message.length > 0 && (
                <Banner
                    visible={true}
                    actions={[]}
                    icon="alert-circle"
                    style={{marginBottom: 8}}>
                    {message.join(" · ")}. Please try again later!
                </Banner>
            )}
            <PhotoGallery photos={photos} />
            <List.Section>
                <JMSList.Item
                    title={title}
                    description={description}
                    metaTitle={price}
                    titleVariant={'headlineSmall'}
                    metaTitleVariant={'headlineSmall'}
                />
            </List.Section>
        </>
    );
};

export default ProductView;
