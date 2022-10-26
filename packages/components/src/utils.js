function itemSeparator(index, length) {
    console.log(index, length)
    return ((index === 0 && length > 1) || index < length - 1)
}

export {itemSeparator}