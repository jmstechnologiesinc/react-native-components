export const showActionSheet = (actionSheetRef) => {
    actionSheetRef.current.show();
};

export const hideActionSheet = (actionSheetRef) => {
    actionSheetRef.current.hide();
};

export const onUpdateValue = (paymentOptions, index, callback) => {
    for (let i = 0; i < paymentOptions.length; i++) {
        if (i === index) {
            if (paymentOptions[i].hasOwnProperty('selected')) {
                paymentOptions[i].selected = true;
            }
        } else {
            if (paymentOptions[i].hasOwnProperty('selected')) {
                paymentOptions[i].selected = false;
            }
        }
    }

    return callback([...paymentOptions]);
};
