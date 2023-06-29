import { Linking, Platform } from 'react-native';
import { getMainPhoto } from '@jmstechnologiesinc/commons'
import Config from 'react-native-config';

export const makeLinkingCall = (phone) => {
    if (Platform.OS === 'android') {
        Linking.openURL(`tel: +${phone}`);
    } else {
        console.log('Call');
        Linking.openURL(`telprompt:: +${phone}`);
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
        const path = getMainPhoto(photos);
        return `${urlImageKit}/${path}`;
    } else if (photos.includes?.('https://')) {
        return photos;
    }
    return `${urlImageKit}/${photos}`;
};

export { itemSeparator, showActionSheet, hideActionSheet, imagekitUrl };
