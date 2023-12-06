
export const handleDateOfBirhtChange = (text, inputActionHandler, callback, dateOfBirth) => {
    if ((text.length === 2 && dateOfBirth.length === 3) || (text.length === 5 && dateOfBirth.length === 6)) {
        text = text.slice(0, -1);
    } else if (text.length === 2 || text.length === 5) {
        text += '/';
    }
    callback(text);
    return inputActionHandler('dateofBirth', text);
};
