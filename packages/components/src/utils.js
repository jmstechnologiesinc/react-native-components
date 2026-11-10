import { Dimensions, Linking, PixelRatio, Platform } from 'react-native';

import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';

import { Config } from './Config';

export const makeLinkingCall = (phoneNumber) => {
    if (Platform.OS === 'android') {
        Linking.openURL(`tel: +${phoneNumber}`);
    } else {
        console.log('Call');
        Linking.openURL(`telprompt:: +${phoneNumber}`);
    }
};

function itemSeparator(index, length) {
    return (index === 0 && length > 1) || index < length - 1;
}

const showActionSheet = (actionSheetRef) => {
    actionSheetRef.current.show();
};

const hideActionSheet = (actionSheetRef) => {
    actionSheetRef.current.hide();
};

const isAVIFSupported = () => {
    if (Platform.OS === 'ios') {
        return Platform.Version >= 16 ? true : false;
    } else if (Platform.OS === 'android') {
        return   false;
    }
    return true;
};

const format = isAVIFSupported() ? 'f-avif' : 'f-jpeg';

function isPublicUrl(url) {
    return url?.includes?.('https://');
}

const imagekitUrl = (photos) => {
    const urlImageKit = `https://ik.imagekit.io/${Config.IMAGEKIT_URL}`;

    if (photos === null || photos === undefined) {
        return null;
    } else if (Array.isArray(photos)) {
        return photos.map((photo) => {
            if (photo?.includes('https://')) {
                return photo;
            } else {
                return `${urlImageKit}/${photo}`;
            }
        });
    } else if (photos.includes?.('https://')) {
        return photos;
    } else {
        return `${urlImageKit}/${photos}`;
    }
};

function imageKitListImage(photo) {
    return imagekitUrl(
        `tr:h-${moderateScale(76)},w-${moderateScale(
            76
        )},q-100,pr-true,fo-auto,lo-true,${format},dpr-${PixelRatio.get()}/${photo}`
    );
}

function imageKitListImagelqip(photo) {
    return imagekitUrl(`tr:h-${moderateScale(76)},w-${moderateScale(76)},q-1,bl-10,f-webp/${photo}`);
}

function imageKitAvatar(photo) {
    return imagekitUrl(
        `tr:h-${moderateScale(150)},w-${moderateScale(150)},r-${moderateScale(
            150
        )},q-100,pr-true,fo-face,lo-true,${format},dpr-${PixelRatio.get()}/${photo}`
    );
}

function imageKitPhotoGalleryMainImage(photo, cropMode = 'cm-pad_resize') {
    return imagekitUrl(
        `tr:h-${moderateScale(195)},w-${
            Dimensions.get('window').width
        },q-100,pr-true,${cropMode},fo-auto,lo-true,${format},dpr-${PixelRatio.get()}/${photo}`
    );
}

function imageKitPhotoGalleryMainImageLqip(photo, cropMode = 'cm-pad_resize') {
    return imagekitUrl(
        `tr:h-${moderateScale(195)},w-${Dimensions.get('window').width},q-1,${cropMode},bl-10,f-webp/${photo}`
    );
}

// Card.Cover's frame (Material's 16:9 card media). ImageKit crops the photo to it at the card's own width, so the
// photo is fetched at the size the card shows it, whatever the window.
const CARD_ASPECT_RATIO = 'ar-16-9';

/**
 * @param {string|string[]} photo
 * @param {number} width the card's width, in dp
 */
function imageKitCard(photo, width) {
    return imagekitUrl(
        `tr:w-${Math.round(
            width
        )},${CARD_ASPECT_RATIO},q-100,pr-true,fo-auto,lo-true,${format},dpr-${PixelRatio.get()}/${photo}`
    );
}

/**
 * @param {string|string[]} photo
 * @param {number} width the card's width, in dp
 */
function imageKitCardLqip(photo, width) {
    return imagekitUrl(`tr:w-${Math.round(width)},${CARD_ASPECT_RATIO},q-1,bl-10,f-webp/${photo}`);
}

export {
    itemSeparator,
    showActionSheet,
    hideActionSheet,
    imagekitUrl,
    imageKitListImage,
    imageKitAvatar,
    imageKitPhotoGalleryMainImage,
    imageKitPhotoGalleryMainImageLqip,
    imageKitCard,
    imageKitCardLqip,
    imageKitListImagelqip,
    isPublicUrl,
};
