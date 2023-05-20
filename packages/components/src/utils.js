import { Linking, Platform } from 'react-native';

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

export { itemSeparator, showActionSheet, hideActionSheet };
