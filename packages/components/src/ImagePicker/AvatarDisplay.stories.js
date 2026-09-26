import React from 'react';

import AvatarDisplay from './AvatarDisplay';

export default {
    title: 'packages/AvatarDisplay',
};

const PHOTO = 'https://picsum.photos/id/64/300/300';

export const Photo = () => <AvatarDisplay photo={PHOTO} />;

export const NoPhoto = () => <AvatarDisplay icon="account" />;

// A pending change replaced the photo: the «Changed» line marks it.
export const Changed = () => <AvatarDisplay photo={PHOTO} accessibilityLabel="Driver photo" highlighted />;
