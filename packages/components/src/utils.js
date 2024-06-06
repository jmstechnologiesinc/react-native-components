import { Dimensions, Linking, PixelRatio, Platform } from 'react-native';
import Config from 'react-native-config';
import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { MD3LightTheme } from '@jmstechnologiesinc/react-native-paper';

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


const imagekitUrl = (photos) => {
    const urlImageKit = `https://ik.imagekit.io/${Config.IMAGEKIT_URL}`;

    if (photos === null || photos === undefined) {
        return null;
    } else if (Array.isArray(photos)) {
        return photos.map(photo => {
            if (photo?.includes('https://')) {
                return photo;
            } else {
                return `${urlImageKit}/${photo}`;
            }
        });
    } else if (photos.includes?.('https://')) {
        return photos;
    } else {
        return `${urlImageKit}/${photos}`
    }
};


function imageKitListImage(photo) {
    return imagekitUrl(`tr:h-${moderateScale(76)},w-${moderateScale(76)},q-100,pr-true,fo-auto,lo-true,f-avif,dpr-${PixelRatio.get()}/${photo}`)
}

function imageKitListImagelqip(photo) {
    return imagekitUrl(`tr:h-${moderateScale(76)},w-${moderateScale(76)},q-1,bl-10,f-webp/${photo}`)
}

function imageKitAvatar(photo) {
    return imagekitUrl(`tr:h-${moderateScale(150)},w-${moderateScale(150)},r-${moderateScale(150)},q-100,pr-true,fo-face,lo-true,f-avif,dpr-${PixelRatio.get()}/${photo}`)
}

function imageKitPhotoGalleryMainImage(photo, cropMode="cm-pad_resize") {
    return imagekitUrl(`tr:h-${moderateScale(195)},w-${Dimensions.get('window').width},q-100,pr-true,${cropMode},fo-auto,lo-true,f-avif,dpr-${PixelRatio.get()}/${photo}`)
}

function imageKitPhotoGalleryMainImageLqip(photo, cropMode="cm-pad_resize") {
    console.log(imagekitUrl(`tr:h-${moderateScale(195)},w-${Dimensions.get('window').width},q-1,${cropMode},bl-10,f-webp/${photo}`))
    return imagekitUrl(`tr:h-${moderateScale(195)},w-${Dimensions.get('window').width},q-1,${cropMode},bl-10,f-webp/${photo}`)
}

const HORIZONTAL_CARD_PADDING = MD3LightTheme.spacing.x4 * 2;
const NET_CARD_WIDTH = Dimensions.get('window').width - HORIZONTAL_CARD_PADDING;

function imageKitCard(photo) {
    return imagekitUrl(`tr:w-${NET_CARD_WIDTH},h-${moderateScale(195)},q-100,pr-true,fo-auto,lo-true,f-avif,dpr-${PixelRatio.get()}/${photo}`)
}

function imageKitCardLqip(photo) {
    return imagekitUrl(`tr:w-${NET_CARD_WIDTH},h-${moderateScale(195)},q-1,bl-10,f-webp/${photo}`)
}

export { itemSeparator, showActionSheet, hideActionSheet, imagekitUrl, imageKitListImage, imageKitAvatar, imageKitPhotoGalleryMainImage, imageKitPhotoGalleryMainImageLqip, imageKitCard,imageKitCardLqip,imageKitListImagelqip };
