import React from 'react';

import PhotoGallery from './PhotoGallery';

export default {
    title: 'packages/PhotoGallery',
    component: PhotoGallery,
};

export const photos = [
    'https://cdn.pixabay.com/photo/2017/03/26/11/53/hors-doeuvre-2175326_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/06/29/20/16/food-2456100_1280.jpg',
    'https://cdn.pixabay.com/photo/2022/03/19/12/33/side-dish-7078451_1280.jpg',
    'https://pixabay.com/es/photos/kimchi-blanco-plato-comida-5939213/',
];

export const SinglePhoto = () => <PhotoGallery photos={[photos[0]]} />;

export const MultiplePhotos = () => <PhotoGallery photos={photos} />;
