import React, { useRef, useState } from 'react';

import ImagePickerAvatar from '../ImagePicker/ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DocumentRequirementCard from './DocumentRequirementCard';

/**
 * Contract request #117: a document requirement's card with the way to send it, as the server says one version of it
 * is taken (`item.capture`, K-32): one photo, or the front and then the back (§9.8.1 step 1). Photos only (owner,
 * 2026-11-04): the card offers no PDF. The front waits here, shown as the card's cover with what to do next, until
 * the back is taken; then `onCapture(photos)` gets the pages in order (the picker's assets) and the host sends them.
 * The photo sheet is the library's picker, opened by the card's own button (`variant="sheet"`). Not portable: the
 * picker is native.
 *
 * @param {{item: object, subtitle?: ?string, onCapture: (photos: Array<object>) => void, isDisabled?: boolean,
 *     testID?: string}} props
 */
const DocumentCaptureCard = ({ item, subtitle, onCapture, isDisabled = false, testID = 'document-requirement' }) => {
    const pickerRef = useRef();
    const [front, setFront] = useState(null);
    const twoSided = item.capture?.pages === 2;

    const take = (photo) => {
        if (twoSided && !front) {
            setFront(photo);
            return;
        }
        setFront(null);
        onCapture(front ? [front, photo] : [photo]);
    };

    let addLabel = localized('add');
    if (twoSided) addLabel = localized(front ? 'documentAddBack' : 'documentAddFront');
    const add = { label: addLabel, onPress: () => pickerRef.current?.show(), isDisabled, testID: `${testID}-add` };

    // Card.Actions makes the first button outlined and the next contained: the way to send is the last.
    let actions = [add];
    if (front) {
        actions = [{ label: localized('cancel'), onPress: () => setFront(null), testID: `${testID}-cancel` }, add];
    }

    return (
        <>
            <DocumentRequirementCard
                item={item}
                subtitle={subtitle}
                cover={front?.uri ?? null}
                note={front ? localized('documentAddBackPrompt') : null}
                actions={actions}
                testID={testID}
            />
            <ImagePickerAvatar ref={pickerRef} variant="sheet" onChange={take} />
        </>
    );
};

export default DocumentCaptureCard;
