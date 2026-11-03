import React, { useRef, useState } from 'react';

import ImagePickerAvatar from '../ImagePicker/ImagePickerAvatar';
import { localized } from '../Localization/Localization';
import DocumentRequirementCard from './DocumentRequirementCard';

/**
 * Contract request #117: a document requirement's card with the way to send it, as the server says one version of it
 * is taken (`item.capture`, K-32): one photo, or the front and then the back (§9.8.1 step 1), and one PDF from the
 * phone's browser when `capture.pdf` and the host can open the link (#66; never while the console acts as the
 * partner). Taking a photo sends nothing (owner, 2026-11-03): the pages taken show as the card's covers, and the
 * partner sends them with the card's last action, «Send to review», or drops them with «Cancel»; then
 * `onCapture(photos)` gets the pages in order (the picker's assets) and the host sends them. The photo sheet is the
 * library's picker, opened by the card's own button (`variant="sheet"`). Not portable: the picker is native.
 *
 * @param {{item: object, subtitle?: ?string, onCapture: (photos: Array<object>) => void,
 *     onUploadPdf?: ?(() => void), isDisabled?: boolean, testID?: string}} props
 */
const DocumentCaptureCard = ({
    item,
    subtitle,
    onCapture,
    onUploadPdf,
    isDisabled = false,
    testID = 'document-requirement',
}) => {
    const pickerRef = useRef();
    const [pages, setPages] = useState([]);
    const pageCount = item.capture?.pages === 2 ? 2 : 1;
    const twoSided = pageCount === 2;
    const complete = pages.length === pageCount;

    const take = (photo) => setPages((taken) => (taken.length < pageCount ? [...taken, photo] : taken));
    const cancel = () => setPages([]);
    const send = () => {
        const photos = pages;
        setPages([]);
        onCapture(photos);
    };

    let addLabel = localized('add');
    if (twoSided) addLabel = localized(pages.length === 0 ? 'documentAddFront' : 'documentAddBack');
    const add = { label: addLabel, onPress: () => pickerRef.current?.show(), isDisabled, testID: `${testID}-add` };
    const cancelAction = { label: localized('cancel'), onPress: cancel, testID: `${testID}-cancel` };

    // MD3: a card's actions close it, the main one last. Card.Actions makes the first button outlined and the next
    // contained, so what moves the partner forward (add the next side, or send) is the last.
    let actions = [add];
    if (complete) {
        actions = [
            cancelAction,
            { label: localized('sendToReview'), onPress: send, isDisabled, testID: `${testID}-send` },
        ];
    } else if (pages.length > 0) {
        actions = [cancelAction, add];
    } else if (item.capture?.pdf && onUploadPdf) {
        actions = [
            { label: localized('documentUploadPdf'), onPress: onUploadPdf, isDisabled, testID: `${testID}-pdf` },
            add,
        ];
    }

    return (
        <>
            <DocumentRequirementCard
                item={item}
                subtitle={subtitle}
                covers={pages.map((page) => page.uri)}
                note={twoSided && pages.length === 1 ? localized('documentAddBackPrompt') : null}
                actions={actions}
                testID={testID}
            />
            <ImagePickerAvatar ref={pickerRef} variant="sheet" onChange={take} />
        </>
    );
};

export default DocumentCaptureCard;
