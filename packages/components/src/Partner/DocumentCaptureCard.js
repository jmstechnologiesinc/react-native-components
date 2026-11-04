import React, { useRef, useState } from 'react';

import ImagePickerAvatar from '../ImagePicker/ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DocumentRequirementCard from './DocumentRequirementCard';

/**
 * Contract request #117: a document requirement's card with the way to send it, as the server says one version of it
 * is taken (`item.capture`, K-32): one photo, or the front and then the back (§9.8.1 step 1). Photos only (owner,
 * 2026-11-04): the card offers no PDF. Taking a photo sends nothing (owner, 2026-11-04): the pages taken show as the
 * card's covers (both sides in a carousel, owner 2026-11-04), and «Send to review» sends them once every page is
 * there; then `onCapture(photos)` gets them in order (the picker's assets) and the host sends them. The photo sheet is
 * the library's picker, opened by the card's own button (`variant="sheet"`). Not portable: the picker is native.
 *
 * @param {{item: object, subtitle?: ?string, onCapture: (photos: Array<object>) => void, isDisabled?: boolean,
 *     testID?: string}} props
 */
const DocumentCaptureCard = ({ item, subtitle, onCapture, isDisabled = false, testID = 'document-requirement' }) => {
    const pickerRef = useRef();
    const [pages, setPages] = useState([]);
    const pageCount = item.capture?.pages === 2 ? 2 : 1;
    const twoSided = pageCount === 2;
    const complete = pages.length === pageCount;

    // A photo taken once every page is there starts the document again: that is how a wrong one is replaced.
    const take = (photo) => setPages((taken) => (taken.length < pageCount ? [...taken, photo] : [photo]));
    const send = () => {
        const photos = pages;
        setPages([]);
        onCapture(photos);
    };

    // What a screen reader names each photo: the front and the back of a two-sided document, else the document.
    const covers = pages.map((page, index) => {
        let label = localized('global.document');
        if (twoSided) label = localized(index === 0 ? 'documentFront' : 'documentBack');
        return { uri: page.uri, label };
    });

    let addLabel = localized('add');
    if (twoSided) addLabel = localized(pages.length === 1 ? 'documentAddBack' : 'documentAddFront');

    // MD3: the way to take a photo stays, and the main action, sending, is last (Card.Actions makes the first button
    // outlined and the next contained); it waits, disabled, until every page is taken.
    const actions = [
        { label: addLabel, onPress: () => pickerRef.current?.show(), isDisabled, testID: `${testID}-add` },
        {
            label: localized('sendToReview'),
            onPress: send,
            isDisabled: isDisabled || !complete,
            testID: `${testID}-send`,
        },
    ];

    return (
        <>
            <DocumentRequirementCard
                item={item}
                subtitle={subtitle}
                covers={covers}
                note={twoSided && pages.length === 1 ? localized('documentAddBackPrompt') : null}
                actions={actions}
                testID={testID}
            />
            <ImagePickerAvatar ref={pickerRef} variant="sheet" onChange={take} />
        </>
    );
};

export default DocumentCaptureCard;
